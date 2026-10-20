import { Router } from "express";
import { getProfile, updateProfile, exportData, deleteAccount } from "../controllers/profileController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/", getProfile);
router.put("/", updateProfile);
router.get("/export", exportData);
router.delete("/account", deleteAccount);

export default router;
