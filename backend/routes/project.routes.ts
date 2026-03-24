import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";


const router = Router();

router.post("/project", authMiddleware, createProject)
router.get("/project", authMiddleware, getAllProjects)
router.get("/project/:projectId", authMiddleware, getProjectById)
router.put("/project/:projectId", authMiddleware, updateProject)
router.delete("/project/:projectId", authMiddleware, deleteProject)

export default router