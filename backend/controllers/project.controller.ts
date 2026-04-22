import { Request, Response } from 'express';
import { AuthRequest } from "../Interfaces/auth.interface";
import { ProjectModel } from "../models/project.model";
import { CreateProject, UpdateProject } from '../schemas/project.schema';
import { ZodError } from 'zod';

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const parsedData = CreateProject.parse(req.body)
        const { title, description, techStack, githubLink, livelink } = parsedData
        const project = await ProjectModel.create({
            title,
            description,
            techStack,
            githubLink,
            livelink,
            owner: req.user.id
        });
        res.status(201).json({
            project,
            msg: "Project created successfully"
        })
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                msg: "Input data error"
            })
        }
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const response = await ProjectModel.find().populate('owner', 'name email');
        res.status(200).json({
            response
        })
    }
    catch (error) {
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const response = await ProjectModel.findById(projectId);
        if (!response) {
            return res.status(404).json({
                msg: "Invalid projectId"
            })
        }
        res.status(201).json({
            response
        })
    }
    catch (error) {
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}

export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        const parsedData = UpdateProject.parse(req.body)
        const { projectId } = req.params;
        const { title, description, techStack, githubLink, livelink } = parsedData
        const project = await ProjectModel.findOne({ _id: projectId })
        if (!project) {
            return res.status(404).json({
                msg: "Invalid projectId"
            })
        }
        if (project.owner.toString() == req.user.id) {
            await ProjectModel.updateOne(
                { _id: projectId },
                { $set: { title, description, techStack, githubLink, livelink } }
            )
            res.status(200).json({
                msg: "Project updated successfully"
            })
        } else {
            res.status(403).json({
                msg: "403 forbidden"
            })
        }

    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                msg: "Input data error"
            })
        }
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}


export const deleteProject = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const project = await ProjectModel.findOne({ _id: projectId })
        if (!project) {
            return res.status(404).json({
                msg: "Invalid projectId"
            })
        }
        if (project.owner.toString() == req.user.id) {
            await ProjectModel.deleteOne(
                { _id: projectId },
            )
            res.status(200).json({
                msg: "Project deleted successfully"
            })
        } else {
            res.status(403).json({
                msg: "403 forbidden"
            })
        }

    }
    catch (error) {
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}


export const upvoteProject = async (req : AuthRequest, res : Response) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await ProjectModel.findById(projectId).select("upvotes");
        if (!project) {
            return res.status(404).json({
                msg: "Invalid projectId"
            });
        }

        const hasUpvoted = (project.upvotes as any[]).some((upvoteUserId: any) => upvoteUserId.toString() === userId);

        if (!hasUpvoted) {
            await ProjectModel.updateOne(
                { _id: projectId },
                {
                    $addToSet: { upvotes: userId },
                    $inc: { upvoteCount: 1 }
                }
            );

            return res.status(200).json({
                msg: "Project upvoted",
                upvoted: true
            });
        }

        await ProjectModel.updateOne(
            { _id: projectId },
            {
                $pull: { upvotes: userId },
                $inc: { upvoteCount: -1 }
            }
        );

        return res.status(200).json({
            msg: "Project upvote removed",
            upvoted: false
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Something went wrong"
        });
    }
}