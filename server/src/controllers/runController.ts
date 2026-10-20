import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { createRunSchema } from "../validators/runValidators.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { calculateFilteredRouteDistance } from "../utils/haversine.js";
import { calculateRunningCalories, formatPace } from "../utils/pace.js";

export async function createRun(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = createRunSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { profile: true }
    });

    // If client supplied route points, verify distance with Haversine filtering
    let finalDistance = validated.distanceKm;
    if (validated.routePoints && validated.routePoints.length >= 2) {
      const computedDistance = calculateFilteredRouteDistance(validated.routePoints);
      if (computedDistance > 0) {
        finalDistance = computedDistance;
      }
    }

    const userWeight = user?.profile?.weight || 72;
    const finalCalories = validated.caloriesBurned > 0
      ? validated.caloriesBurned
      : calculateRunningCalories(finalDistance, validated.durationSeconds, userWeight);

    const finalPace = validated.avgPace && validated.avgPace !== "--:-- /km"
      ? validated.avgPace
      : formatPace(validated.durationSeconds, finalDistance);

    const run = await prisma.run.create({
      data: {
        userId: req.userId!,
        durationSeconds: validated.durationSeconds,
        distanceKm: finalDistance,
        avgPace: finalPace,
        caloriesBurned: finalCalories,
        notes: validated.notes,
        completedAt: new Date(),
        routePoints: {
          create: validated.routePoints.map((pt, idx) => ({
            latitude: pt.latitude,
            longitude: pt.longitude,
            accuracy: pt.accuracy,
            speed: pt.speed,
            pointIndex: pt.pointIndex ?? idx,
            timestamp: pt.timestamp ? new Date(pt.timestamp) : new Date()
          }))
        }
      },
      include: {
        routePoints: {
          orderBy: { pointIndex: "asc" }
        }
      }
    });

    // Check achievements
    const totalRuns = await prisma.run.count({ where: { userId: req.userId } });
    if (totalRuns === 1) {
      await prisma.achievement.create({
        data: {
          userId: req.userId!,
          type: "FIRST_RUN",
          title: "Road Warrior",
          description: "Completed your first outdoor GPS run.",
          icon: "footprints"
        }
      });
    }

    if (finalDistance >= 5.0) {
      const has5k = await prisma.achievement.findFirst({
        where: { userId: req.userId, type: "5K_COMPLETED" }
      });
      if (!has5k) {
        await prisma.achievement.create({
          data: {
            userId: req.userId!,
            type: "5K_COMPLETED",
            title: "5K Finisher",
            description: "Crushed a 5 kilometer run distance.",
            icon: "trophy"
          }
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Run saved successfully!",
      data: run
    });
  } catch (error) {
    next(error);
  }
}

export async function getRuns(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const runs = await prisma.run.findMany({
      where: { userId: req.userId },
      orderBy: { startedAt: "desc" },
      include: {
        _count: {
          select: { routePoints: true }
        }
      }
    });

    res.json({
      success: true,
      count: runs.length,
      data: runs
    });
  } catch (error) {
    next(error);
  }
}

export async function getRunById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const run = await prisma.run.findFirst({
      where: { id, userId: req.userId },
      include: {
        routePoints: {
          orderBy: { pointIndex: "asc" }
        }
      }
    });

    if (!run) {
      res.status(404).json({ success: false, message: "Run not found." });
      return;
    }

    res.json({
      success: true,
      data: run
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteRun(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const run = await prisma.run.findFirst({
      where: { id, userId: req.userId }
    });

    if (!run) {
      res.status(404).json({ success: false, message: "Run not found." });
      return;
    }

    await prisma.run.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: "Run deleted successfully."
    });
  } catch (error) {
    next(error);
  }
}
