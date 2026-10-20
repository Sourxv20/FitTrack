import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { calculateActivityStreak } from "../utils/streak.js";

export async function getProgressSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;

    const [workoutSessions, runs, yoyoTests] = await Promise.all([
      prisma.workoutSession.findMany({
        where: { userId },
        select: { startedAt: true, durationSeconds: true, caloriesBurned: true, exercisesCompletedCount: true }
      }),
      prisma.run.findMany({
        where: { userId },
        select: { startedAt: true, durationSeconds: true, distanceKm: true, caloriesBurned: true, avgPace: true }
      }),
      prisma.yoYoTest.findMany({
        where: { userId },
        orderBy: { completedAt: "asc" }
      })
    ]);

    const totalWorkouts = workoutSessions.length;
    const totalRuns = runs.length;
    const totalYoYoTests = yoyoTests.length;

    const workoutCalories = workoutSessions.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
    const runCalories = runs.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
    const yoyoCalories = yoyoTests.reduce((acc, curr) => acc + curr.calories, 0);
    const totalCalories = workoutCalories + runCalories + yoyoCalories;

    const totalDistanceKm = Math.round(runs.reduce((acc, curr) => acc + curr.distanceKm, 0) * 100) / 100;

    const totalWorkoutSeconds = workoutSessions.reduce((acc, curr) => acc + curr.durationSeconds, 0);
    const totalRunSeconds = runs.reduce((acc, curr) => acc + curr.durationSeconds, 0);
    const totalYoYoSeconds = yoyoTests.reduce((acc, curr) => acc + curr.duration, 0);
    const totalActiveMinutes = Math.round((totalWorkoutSeconds + totalRunSeconds + totalYoYoSeconds) / 60);

    // Calculate real database streak
    const allActivityDates = [
      ...workoutSessions.map((w) => w.startedAt),
      ...runs.map((r) => r.startedAt),
      ...yoyoTests.map((y) => y.completedAt)
    ];

    const currentStreak = calculateActivityStreak(allActivityDates);

    // Yo-Yo Aggregates
    let bestYoYoLevel: string | null = null;
    let bestYoYoDistance: number | null = null;
    let latestYoYoTest: any = null;

    if (yoyoTests.length > 0) {
      const sortedByDistance = [...yoyoTests].sort((a, b) => b.distance - a.distance);
      const topTest = sortedByDistance[0];
      bestYoYoLevel = `Level ${topTest.finalLevel}.${topTest.finalShuttle}`;
      bestYoYoDistance = topTest.distance;

      const latest = yoyoTests[yoyoTests.length - 1];
      latestYoYoTest = {
        id: latest.id,
        testType: latest.testType,
        level: `Level ${latest.finalLevel}.${latest.finalShuttle}`,
        finalLevel: latest.finalLevel,
        finalShuttle: latest.finalShuttle,
        finalSpeed: latest.finalSpeed,
        distance: latest.distance,
        duration: latest.duration,
        calories: latest.calories,
        completedAt: latest.completedAt
      };
    }

    const yoyoChartData = yoyoTests.map((t, idx) => ({
      testNumber: idx + 1,
      name: `Test ${idx + 1}`,
      level: `Level ${t.finalLevel}.${t.finalShuttle}`,
      distance: t.distance,
      speed: t.finalSpeed,
      date: t.completedAt.toISOString().split("T")[0]
    }));

    res.json({
      success: true,
      data: {
        totalWorkouts,
        totalRuns,
        totalYoYoTests,
        totalCalories,
        totalDistanceKm,
        totalActiveMinutes,
        currentStreak,
        yoyo: {
          bestLevel: bestYoYoLevel,
          bestDistance: bestYoYoDistance,
          latestTest: latestYoYoTest,
          chartData: yoyoChartData,
          history: yoyoTests.map((t) => ({
            id: t.id,
            testType: t.testType,
            level: `Level ${t.finalLevel}.${t.finalShuttle}`,
            finalLevel: t.finalLevel,
            finalShuttle: t.finalShuttle,
            finalSpeed: t.finalSpeed,
            distance: t.distance,
            duration: t.duration,
            calories: t.calories,
            completedAt: t.completedAt
          })).reverse()
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getProgressAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const timeframe = (req.query.timeframe as string) || "7d"; // 7d, 30d, 90d

    let daysCount = 7;
    if (timeframe === "30d") daysCount = 30;
    if (timeframe === "90d") daysCount = 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount + 1);
    startDate.setHours(0, 0, 0, 0);

    const [workoutSessions, runs] = await Promise.all([
      prisma.workoutSession.findMany({
        where: {
          userId,
          startedAt: { gte: startDate }
        },
        orderBy: { startedAt: "asc" }
      }),
      prisma.run.findMany({
        where: {
          userId,
          startedAt: { gte: startDate }
        },
        orderBy: { startedAt: "asc" }
      })
    ]);

    // Build day map for the entire range
    const chartMap = new Map<string, {
      date: string;
      displayDate: string;
      workoutMinutes: number;
      runDistance: number;
      calories: number;
      workoutsCount: number;
      runsCount: number;
    }>();

    for (let i = 0; i < daysCount; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const displayDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      chartMap.set(key, {
        date: key,
        displayDate,
        workoutMinutes: 0,
        runDistance: 0,
        calories: 0,
        workoutsCount: 0,
        runsCount: 0
      });
    }

    workoutSessions.forEach((w) => {
      const key = `${w.startedAt.getFullYear()}-${String(w.startedAt.getMonth() + 1).padStart(2, "0")}-${String(w.startedAt.getDate()).padStart(2, "0")}`;
      const entry = chartMap.get(key);
      if (entry) {
        entry.workoutMinutes += Math.round(w.durationSeconds / 60);
        entry.calories += w.caloriesBurned;
        entry.workoutsCount += 1;
      }
    });

    runs.forEach((r) => {
      const key = `${r.startedAt.getFullYear()}-${String(r.startedAt.getMonth() + 1).padStart(2, "0")}-${String(r.startedAt.getDate()).padStart(2, "0")}`;
      const entry = chartMap.get(key);
      if (entry) {
        entry.runDistance = Math.round((entry.runDistance + r.distanceKm) * 100) / 100;
        entry.calories += r.caloriesBurned;
        entry.runsCount += 1;
      }
    });

    const chartData = Array.from(chartMap.values());

    res.json({
      success: true,
      timeframe,
      data: chartData
    });
  } catch (error) {
    next(error);
  }
}
