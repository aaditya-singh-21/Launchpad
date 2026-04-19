import { createProject, deleteProject, getAllProjects, getProjectById, updateProject, upvoteProject } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";


const router = Router();

router.post("/project", authMiddleware, createProject)
router.get("/project", getAllProjects)
router.get("/project/:projectId", authMiddleware, getProjectById)
router.put("/project/:projectId", authMiddleware, updateProject)
router.delete("/project/:projectId", authMiddleware, deleteProject)
router.patch("/project/:projectId/upvote", authMiddleware, upvoteProject)

export default router