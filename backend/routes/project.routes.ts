import { createProject, deleteProject, getAllProjects, getProjectById, updateProject, upvoteProject, getComments, addComment, updateComment, deleteComment } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";


const router = Router();

router.post("/project", authMiddleware, createProject)
router.get("/project", getAllProjects)
router.get("/project/:projectId", authMiddleware, getProjectById)
router.put("/project/:projectId", authMiddleware, updateProject)
router.delete("/project/:projectId", authMiddleware, deleteProject)
router.patch("/project/:projectId/upvote", authMiddleware, upvoteProject)

// Comments Routes
router.get("/project/:projectId/comment", getComments)
router.post("/project/:projectId/comment", authMiddleware, addComment)
router.put("/project/:projectId/comment/:commentId", authMiddleware, updateComment)
router.delete("/project/:projectId/comment/:commentId", authMiddleware, deleteComment)

export default router