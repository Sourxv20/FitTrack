import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";

function parseExerciseJsonFields(ex: any) {
  return {
    ...ex,
    instructions: ex.instructions ? JSON.parse(ex.instructions) : [],
    tips: ex.tips ? JSON.parse(ex.tips) : [],
    mistakes: ex.mistakes ? JSON.parse(ex.mistakes) : [],
    muscles: ex.muscles ? JSON.parse(ex.muscles) : []
  };
}

export async function getExercises(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, difficulty, equipment, search } = req.query;

    const where: any = {};

    if (category && category !== "All") {
      where.category = { equals: String(category), mode: "insensitive" };
    }

    if (difficulty && difficulty !== "All") {
      where.difficulty = { equals: String(difficulty), mode: "insensitive" };
    }

    if (equipment && equipment !== "All") {
      where.equipment = { equals: String(equipment), mode: "insensitive" };
    }

    if (search && String(search).trim() !== "") {
      const q = String(search).trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { muscleGroup: { contains: q, mode: "insensitive" } },
        { equipment: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } }
      ];
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: "asc" }
    });

    const parsed = exercises.map(parseExerciseJsonFields);

    res.json({
      success: true,
      count: parsed.length,
      data: parsed
    });
  } catch (error) {
    next(error);
  }
}

export async function getExerciseById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const exercise = await prisma.exercise.findUnique({
      where: { id }
    });

    if (!exercise) {
      res.status(404).json({ success: false, message: "Exercise not found." });
      return;
    }

    res.json({
      success: true,
      data: parseExerciseJsonFields(exercise)
    });
  } catch (error) {
    next(error);
  }
}
