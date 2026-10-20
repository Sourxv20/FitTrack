import { z } from "zod";

export const workoutSetSchema = z.object({
  exerciseId: z.string().min(1, "Exercise ID is required"),
  setNumber: z.number().int().positive(),
  weightKg: z.number().nonnegative(),
  reps: z.number().int().nonnegative(),
  completed: z.boolean().default(true)
});

export const createWorkoutSessionSchema = z.object({
  workoutPlanId: z.string().optional().nullable(),
  title: z.string().min(1, "Workout title is required"),
  durationSeconds: z.number().int().nonnegative(),
  caloriesBurned: z.number().int().nonnegative(),
  exercisesCompletedCount: z.number().int().nonnegative(),
  notes: z.string().max(1000).optional().nullable(),
  sets: z.array(workoutSetSchema).default([])
});
