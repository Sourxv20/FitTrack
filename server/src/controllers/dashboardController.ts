import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { calculateActivityStreak } from "../utils/streak.js";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, settings: true }
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();

    let greetingPrefix = "Good morning";
    if (currentHour >= 12 && currentHour < 17) {
      greetingPrefix = "Good afternoon";
    } else if (currentHour >= 17) {
      greetingPrefix = "Good evening";
    }

    // Start of today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // Start of current week (Monday)
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const [todayWorkouts, todayRuns, allWorkouts, allRuns, weekWorkouts, weekRuns, todayPlan, latestYoYoTest] = await Promise.all([
      prisma.workoutSession.findMany({
        where: { userId, startedAt: { gte: startOfToday } }
      }),
      prisma.run.findMany({
        where: { userId, startedAt: { gte: startOfToday } }
      }),
      prisma.workoutSession.findMany({
        where: { userId },
        select: { startedAt: true, durationSeconds: true, caloriesBurned: true, title: true, id: true },
        orderBy: { startedAt: "desc" },
        take: 10
      }),
      prisma.run.findMany({
        where: { userId },
        select: { startedAt: true, durationSeconds: true, caloriesBurned: true, distanceKm: true, avgPace: true, id: true },
        orderBy: { startedAt: "desc" },
        take: 10
      }),
      prisma.workoutSession.findMany({
        where: { userId, startedAt: { gte: startOfWeek } },
        select: { startedAt: true, caloriesBurned: true, durationSeconds: true }
      }),
      prisma.run.findMany({
        where: { userId, startedAt: { gte: startOfWeek } },
        select: { startedAt: true, caloriesBurned: true, distanceKm: true }
      }),
      prisma.workoutPlan.findFirst({
        where: { dayOfWeek: DAYS_OF_WEEK[now.getDay()] },
        include: {
          exercises: {
            orderBy: { orderIndex: "asc" },
            include: { exercise: true }
          }
        }
      }),
      prisma.yoYoTest.findFirst({
        where: { userId },
        orderBy: { completedAt: "desc" }
      })
    ]);

    // Today's calories
    const todayCalories =
      todayWorkouts.reduce((acc, curr) => acc + curr.caloriesBurned, 0) +
      todayRuns.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

    const totalWorkoutsCount = await prisma.workoutSession.count({ where: { userId } });
    const allUserRuns = await prisma.run.findMany({
      where: { userId },
      select: { distanceKm: true }
    });
    const totalRunningDistance = Math.round(allUserRuns.reduce((acc, curr) => acc + curr.distanceKm, 0) * 100) / 100;

    // Real database streak calculation
    const allActivityDates = [
      ...allWorkouts.map((w) => w.startedAt),
      ...allRuns.map((r) => r.startedAt)
    ];
    const currentStreak = calculateActivityStreak(allActivityDates);

    // Build weekly breakdown (Mon-Sun)
    const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyBreakdown = daysOrder.map((dayLabel, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(dayDate.getDate() + index);
      const dayDateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, "0")}-${String(dayDate.getDate()).padStart(2, "0")}`;

      const dayWorkouts = weekWorkouts.filter((w) => {
        const d = w.startedAt;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` === dayDateStr;
      });

      const dayRunsList = weekRuns.filter((r) => {
        const d = r.startedAt;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` === dayDateStr;
      });

      const totalDayCalories =
        dayWorkouts.reduce((acc, curr) => acc + curr.caloriesBurned, 0) +
        dayRunsList.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

      const totalDayMinutes = dayWorkouts.reduce((acc, curr) => acc + Math.round(curr.durationSeconds / 60), 0);
      const totalDayDistance = Math.round(dayRunsList.reduce((acc, curr) => acc + curr.distanceKm, 0) * 100) / 100;

      return {
        day: dayLabel,
        calories: totalDayCalories,
        minutes: totalDayMinutes,
        distanceKm: totalDayDistance,
        active: totalDayCalories > 0
      };
    });

    // Recent activity list (combined workouts & runs, top 6)
    const combinedRecent = [
      ...allWorkouts.map((w) => ({
        id: w.id,
        type: "workout" as const,
        title: w.title,
        date: w.startedAt,
        durationMinutes: Math.round(w.durationSeconds / 60),
        calories: w.caloriesBurned,
        detail: `${Math.round(w.durationSeconds / 60)} min`
      })),
      ...allRuns.map((r) => ({
        id: r.id,
        type: "run" as const,
        title: `Outdoor Run • ${r.distanceKm} km`,
        date: r.startedAt,
        durationMinutes: Math.round(r.durationSeconds / 60),
        calories: r.caloriesBurned,
        detail: `${r.distanceKm} km • ${r.avgPace}`
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

    res.json({
      success: true,
      data: {
        greeting: `${greetingPrefix}, ${user.name.split(" ")[0]} 👋`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          dailyCalorieTarget: user.profile?.dailyCalorieTarget || 500,
          fitnessGoal: user.profile?.fitnessGoal || "Build muscle",
          runningGoal: user.profile?.runningGoal || "5K Run"
        },
        stats: {
          todayCalories,
          dailyCalorieTarget: user.profile?.dailyCalorieTarget || 500,
          calorieProgressPercent: Math.min(100, Math.round((todayCalories / (user.profile?.dailyCalorieTarget || 500)) * 100)),
          currentStreak,
          totalWorkouts: totalWorkoutsCount,
          totalRunningDistance
        },
        todayActivity: {
          hasDoneWorkout: todayWorkouts.length > 0,
          hasDoneRun: todayRuns.length > 0,
          todayPlan: todayPlan ? {
            id: todayPlan.id,
            title: todayPlan.title,
            focus: todayPlan.focus,
            duration: todayPlan.duration,
            targetCalories: todayPlan.targetCalories,
            exercisesCount: todayPlan.exercises.length
          } : null
        },
        weeklyBreakdown,
        recentActivity: combinedRecent,
        latestYoYoTest: latestYoYoTest ? {
          id: latestYoYoTest.id,
          testType: latestYoYoTest.testType,
          level: `Level ${latestYoYoTest.finalLevel}.${latestYoYoTest.finalShuttle}`,
          finalLevel: latestYoYoTest.finalLevel,
          finalShuttle: latestYoYoTest.finalShuttle,
          finalSpeed: latestYoYoTest.finalSpeed,
          distance: latestYoYoTest.distance,
          completedAt: latestYoYoTest.completedAt
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
}
