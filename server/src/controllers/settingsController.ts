import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { settingsUpdateSchema } from "../validators/authValidators.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export async function getSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: req.userId }
    });

    res.json({
      success: true,
      data: settings || { theme: "system", units: "metric", notifications: true }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = settingsUpdateSchema.parse(req.body);

    const updated = await prisma.userSettings.upsert({
      where: { userId: req.userId },
      update: validated,
      create: {
        userId: req.userId!,
        theme: validated.theme || "system",
        units: validated.units || "metric",
        notifications: validated.notifications ?? true
      }
    });

    res.json({
      success: true,
      message: "Settings updated successfully.",
      data: updated
    });
  } catch (error) {
    next(error);
  }
}
