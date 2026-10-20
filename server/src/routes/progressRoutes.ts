import { Router } from "express";
import { getProgressSummary, getProgressAnalytics } from "../controllers/progressController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/summary", getProgressSummary);
router.get("/analytics", getProgressAnalytics);

export default router;
