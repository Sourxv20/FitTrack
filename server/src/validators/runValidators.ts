import { z } from "zod";

export const routePointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().nullable().optional(),
  speed: z.number().nullable().optional(),
  timestamp: z.string().or(z.date()).optional(),
  pointIndex: z.number().int().nonnegative()
});

export const createRunSchema = z.object({
  durationSeconds: z.number().int().positive(),
  distanceKm: z.number().positive(),
  avgPace: z.string().min(1),
  caloriesBurned: z.number().int().nonnegative(),
  notes: z.string().max(1000).optional().nullable(),
  routePoints: z.array(routePointSchema).default([])
});
