import { authMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";
import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from "../Interfaces/auth.interface";
import { UserModel } from "../models/user.model";
import { getMe } from "../controllers/user.controller";
const router = Router();

router.get("/me", authMiddleware, getMe)