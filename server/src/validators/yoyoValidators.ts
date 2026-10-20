import { z } from "zod";

export const createYoYoTestSchema = z.object({
  testType: z.string().default("Yo-Yo IR1"),
  finalLevel: z.number().int().min(1),
  finalShuttle: z.number().int().min(1),
  finalSpeed: z.number().positive(),
  distance: z.number().int().positive(),
  duration: z.number().int().nonnegative(),
  calories: z.number().int().nonnegative(),
  completedAt: z.string().or(z.date()).optional()
});
