import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional()
});

export const emailLoginSchema = z.object({
  email: z.string().email("Invalid email address")
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  height: z.number().positive().optional().nullable(),
  weight: z.number().positive().optional().nullable(),
  fitnessGoal: z.string().optional().nullable(),
  runningGoal: z.string().optional().nullable(),
  dailyCalorieTarget: z.number().int().positive().optional(),
  bio: z.string().max(500).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable()
});

export const settingsUpdateSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  units: z.enum(["metric", "imperial"]).optional(),
  notifications: z.boolean().optional()
});
