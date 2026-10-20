import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { createYoYoTestSchema } from "../validators/yoyoValidators.js";

export async function createYoYoTest(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const validatedData = createYoYoTestSchema.parse(req.body);

    const test = await prisma.yoYoTest.create({
      data: {
        userId,
        testType: validatedData.testType || "Yo-Yo IR1",
        finalLevel: validatedData.finalLevel,
        finalShuttle: validatedData.finalShuttle,
        finalSpeed: validatedData.finalSpeed,
        distance: validatedData.distance,
        duration: validatedData.duration,
        calories: validatedData.calories,
        completedAt: validatedData.completedAt ? new Date(validatedData.completedAt) : new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: "Yo-Yo test saved successfully.",
      data: test
    });
  } catch (error) {
    next(error);
  }
}

export async function getYoYoTests(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;

    const tests = await prisma.yoYoTest.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" }
    });

    res.json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    next(error);
  }
}

export async function getYoYoTestById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;

    const test = await prisma.yoYoTest.findFirst({
      where: { id, userId }
    });

    if (!test) {
      res.status(404).json({ success: false, message: "Yo-Yo test not found." });
      return;
    }

    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    next(error);
  }
}
