import { Router } from "express";
import { createRun, getRuns, getRunById, deleteRun } from "../controllers/runController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createRun);
router.get("/", getRuns);
router.get("/:id", getRunById);
router.delete("/:id", deleteRun);

export default router;
