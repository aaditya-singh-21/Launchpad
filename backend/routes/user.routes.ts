import { authMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";
import { getMe } from "../controllers/user.controller";
const router = Router();

router.get("/me", authMiddleware, getMe)

export default router