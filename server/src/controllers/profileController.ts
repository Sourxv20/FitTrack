import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { profileUpdateSchema } from "../validators/authValidators.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        profile: true,
        settings: true
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        profile: user.profile,
        settings: user.settings
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = profileUpdateSchema.parse(req.body);

    // Update user's name if provided
    if (validated.name) {
      await prisma.user.update({
        where: { id: req.userId },
        data: { name: validated.name.trim() }
      });
    }

    // Update profile
    const updatedProfile = await prisma.profile.upsert({
      where: { userId: req.userId },
      update: {
        height: validated.height,
        weight: validated.weight,
        fitnessGoal: validated.fitnessGoal,
        runningGoal: validated.runningGoal,
        dailyCalorieTarget: validated.dailyCalorieTarget,
        bio: validated.bio,
        avatarUrl: validated.avatarUrl
      },
      create: {
        userId: req.userId!,
        height: validated.height,
        weight: validated.weight,
        fitnessGoal: validated.fitnessGoal,
        runningGoal: validated.runningGoal,
        dailyCalorieTarget: validated.dailyCalorieTarget ?? 500,
        bio: validated.bio,
        avatarUrl: validated.avatarUrl
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    res.json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        ...user,
        profile: updatedProfile
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function exportData(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const format = (req.query.format as string) || "json";

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        profile: true,
        settings: true,
        workoutSessions: {
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
        },
        runs: {
          include: {
            routePoints: {
              orderBy: { pointIndex: "asc" }
            }
          },
          orderBy: { startedAt: "desc" }
        }
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    if (format === "csv") {
      // Generate clean CSV of workouts and runs
      let csv = "TYPE,ID,TITLE/DATE,DURATION_MIN,DISTANCE_KM,CALORIES,SETS_OR_PACE\n";
      
      user.workoutSessions.forEach((w) => {
        csv += `Workout,"${w.id}","${w.title}",${Math.round(w.durationSeconds / 60)},0,${w.caloriesBurned},${w.sets.length} sets\n`;
      });

      user.runs.forEach((r) => {
        csv += `Run,"${r.id}","${r.startedAt.toISOString()}",${Math.round(r.durationSeconds / 60)},${r.distanceKm},${r.caloriesBurned},"${r.avgPace}"\n`;
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="fittrack_export.csv"');
      res.send(csv);
      return;
    }

    if (format === "gpx") {
      let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="FitTrack - Train Smarter. Run Stronger." xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>FitTrack Activity Export</name>
    <time>${new Date().toISOString()}</time>
  </metadata>\n`;

      user.runs.forEach((r) => {
        gpx += `  <trk>\n    <name>FitTrack Run - ${r.startedAt.toISOString().slice(0, 10)} (${r.distanceKm} km)</name>\n    <desc>Duration: ${Math.round(r.durationSeconds / 60)} min | Pace: ${r.avgPace} /km | Burned: ${r.caloriesBurned} kcal</desc>\n    <trkseg>\n`;
        r.routePoints.forEach((pt) => {
          gpx += `      <trkpt lat="${pt.latitude}" lon="${pt.longitude}">\n        <time>${pt.timestamp.toISOString()}</time>\n      </trkpt>\n`;
        });
        gpx += `    </trkseg>\n  </trk>\n`;
      });

      gpx += `</gpx>`;

      res.setHeader("Content-Type", "application/gpx+xml");
      res.setHeader("Content-Disposition", 'attachment; filename="fittrack_runs.gpx"');
      res.send(gpx);
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="fittrack_export.json"');
    res.json({
      success: true,
      exportedAt: new Date(),
      data: user
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id: req.userId }
    });

    res.json({
      success: true,
      message: "Account and associated data deleted successfully."
    });
  } catch (error) {
    next(error);
  }
}
