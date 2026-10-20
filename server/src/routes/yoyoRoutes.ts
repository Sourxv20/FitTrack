import { Router } from "express";
import { createYoYoTest, getYoYoTests, getYoYoTestById } from "../controllers/yoyoController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createYoYoTest);
router.get("/", getYoYoTests);
router.get("/:id", getYoYoTestById);

export default router;
