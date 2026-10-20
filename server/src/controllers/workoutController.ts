import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { createWorkoutSessionSchema } from "../validators/workoutValidators.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { calculateWorkoutCalories } from "../utils/pace.js";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function getWorkoutPlans(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const plans = await prisma.workoutPlan.findMany({
      include: {
        exercises: {
          orderBy: { orderIndex: "asc" },
          include: {
            exercise: true
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    const parsedPlans = plans.map((plan) => ({
      ...plan,
      exercises: plan.exercises.map((pe) => ({
        ...pe,
        exercise: {
          ...pe.exercise,
          instructions: pe.exercise.instructions ? JSON.parse(pe.exercise.instructions) : [],
          tips: pe.exercise.tips ? JSON.parse(pe.exercise.tips) : [],
          mistakes: pe.exercise.mistakes ? JSON.parse(pe.exercise.mistakes) : [],
          muscles: pe.exercise.muscles ? JSON.parse(pe.exercise.muscles) : []
        }
      }))
    }));

    res.json({
      success: true,
      data: parsedPlans
    });
  } catch (error) {
    next(error);
  }
}

export async function getTodayPlan(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const dayName = DAYS_OF_WEEK[new Date().getDay()];

    const plan = await prisma.workoutPlan.findFirst({
      where: { dayOfWeek: dayName },
      include: {
        exercises: {
          orderBy: { orderIndex: "asc" },
          include: {
            exercise: true
          }
        }
      }
    });

    if (!plan) {
      res.json({ success: true, data: null });
      return;
    }

    const parsed = {
      ...plan,
      exercises: plan.exercises.map((pe) => ({
        ...pe,
        exercise: {
          ...pe.exercise,
          instructions: pe.exercise.instructions ? JSON.parse(pe.exercise.instructions) : [],
          tips: pe.exercise.tips ? JSON.parse(pe.exercise.tips) : [],
          mistakes: pe.exercise.mistakes ? JSON.parse(pe.exercise.mistakes) : [],
          muscles: pe.exercise.muscles ? JSON.parse(pe.exercise.muscles) : []
        }
      }))
    };

    res.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    next(error);
  }
}

export async function createWorkoutSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = createWorkoutSessionSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { profile: true }
    });

    const userWeight = user?.profile?.weight || 72;
    const finalCalories = validated.caloriesBurned > 0
      ? validated.caloriesBurned
      : calculateWorkoutCalories(validated.durationSeconds, validated.sets.length, userWeight);

    const session = await prisma.workoutSession.create({
      data: {
        userId: req.userId!,
        workoutPlanId: validated.workoutPlanId || null,
        title: validated.title,
        durationSeconds: validated.durationSeconds,
        caloriesBurned: finalCalories,
        exercisesCompletedCount: validated.exercisesCompletedCount,
        notes: validated.notes,
        completedAt: new Date(),
        sets: {
          create: validated.sets.map((s) => ({
            exerciseId: s.exerciseId,
            setNumber: s.setNumber,
            weightKg: s.weightKg,
            reps: s.reps,
            completed: s.completed
          }))
        }
      },
      include: {
        sets: {
          include: {
            exercise: {
              select: { name: true, category: true, muscleGroup: true }
            }
          }
        }
      }
    });

    // Check achievement for first workout
    const totalSessions = await prisma.workoutSession.count({ where: { userId: req.userId } });
    if (totalSessions === 1) {
      await prisma.achievement.create({
        data: {
          userId: req.userId!,
          type: "FIRST_WORKOUT",
          title: "First Step Taken",
          description: "Logged your first gym workout session in FitTrack.",
          icon: "dumbbell"
        }
      });
    }

    res.status(201).json({
      success: true,
      message: "Workout completed and saved successfully!",
      data: session
    });
  } catch (error) {
    next(error);
  }
}

export async function getWorkoutHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const sessions = await prisma.workoutSession.findMany({
      where: { userId: req.userId },
      include: {
        sets: {
          include: {
            exercise: {
              select: { name: true, category: true }
            }
          }
        }
      },
      orderBy: { startedAt: "desc" }
    });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
}

export async function getWorkoutSessionById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const session = await prisma.workoutSession.findFirst({
      where: { id, userId: req.userId },
      include: {
        workoutPlan: true,
        sets: {
          orderBy: { createdAt: "asc" },
          include: {
            exercise: true
          }
        }
      }
    });

    if (!session) {
      res.status(404).json({ success: false, message: "Workout session not found." });
      return;
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
}
