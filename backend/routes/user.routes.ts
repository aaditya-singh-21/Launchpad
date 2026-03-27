import { authMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";
import { getMe, updateMe } from "../controllers/user.controller";
const router = Router();

router.get("/me", authMiddleware, getMe)
router.put("/me", authMiddleware, updateMe)

export default router