import { Router } from "express";
import {
  getWorkoutPlans,
  getTodayPlan,
  createWorkoutSession,
  getWorkoutHistory,
  getWorkoutSessionById
} from "../controllers/workoutController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/plans", getWorkoutPlans);
router.get("/today", getTodayPlan);
router.post("/sessions", createWorkoutSession);
router.get("/history", getWorkoutHistory);
router.get("/sessions/:id", getWorkoutSessionById);

export default router;
