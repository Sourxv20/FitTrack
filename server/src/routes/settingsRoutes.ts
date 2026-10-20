import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/", getSettings);
router.put("/", updateSettings);

export default router;
