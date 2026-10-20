import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { registerSchema, loginSchema, emailLoginSchema } from "../validators/authValidators.js";
import { generateTokens, verifyRefreshToken, generateAccessToken } from "../utils/jwt.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() }
    });

    if (existingUser) {
      res.status(409).json({ success: false, message: "An account with this email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validated.name.trim(),
        email: validated.email.toLowerCase(),
        passwordHash,
        profile: {
          create: {
            fitnessGoal: "Build muscle",
            runningGoal: "5K Run",
            dailyCalorieTarget: 500,
            weight: 72,
            height: 175
          }
        },
        settings: {
          create: {
            theme: "system",
            units: "metric",
            notifications: true
          }
        }
      },
      include: {
        profile: true,
        settings: true
      }
    });

    const tokens = generateTokens(user.id);

    res.status(201).json({
      success: true,
      message: "Registration successful. Welcome to FitTrack!",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          settings: user.settings
        },
        ...tokens
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
      include: {
        profile: true,
        settings: true
      }
    });

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password." });
      return;
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid email or password." });
      return;
    }

    const tokens = generateTokens(user.id);

    res.json({
      success: true,
      message: "Logged in successfully.",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          settings: user.settings
        },
        ...tokens
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function emailLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = emailLoginSchema.parse(req.body);
    const cleanEmail = validated.email.toLowerCase().trim();

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        profile: true,
        settings: true
      }
    });

    if (!user) {
      const derivedName = cleanEmail
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const defaultPassword = "FitTrack_" + Math.random().toString(36).substring(2, 8);
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      user = await prisma.user.create({
        data: {
          name: derivedName || "Athlete",
          email: cleanEmail,
          passwordHash,
          profile: {
            create: {
              fitnessGoal: "Build muscle",
              runningGoal: "5K Run",
              dailyCalorieTarget: 500,
              weight: 72,
              height: 175
            }
          },
          settings: {
            create: {
              theme: "system",
              units: "metric",
              notifications: true
            }
          }
        },
        include: {
          profile: true,
          settings: true
        }
      });
    }

    const tokens = generateTokens(user.id);

    res.json({
      success: true,
      message: "Logged in successfully with email.",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          settings: user.settings
        },
        ...tokens
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ success: false, message: "Refresh token is required." });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true }
    });

    if (!user) {
      res.status(401).json({ success: false, message: "User not found or session revoked." });
      return;
    }

    const newAccessToken = generateAccessToken(user.id);

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token." });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
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

export async function logout(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, message: "Logged out successfully." });
}
