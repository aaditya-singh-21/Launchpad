import { Request, Response } from 'express';
import { AuthRequest } from "../Interfaces/auth.interface";
import { ProjectModel } from "../models/project.model";
import { CommentModel } from "../models/comment.model";
import { CreateProject, UpdateProject } from '../schemas/project.schema';
import { Comment } from '../schemas/comment.schema';
import { ZodError } from 'zod';
import { Types } from 'mongoose';

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


export const upvoteProject = async (req: AuthRequest, res: Response) => {
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


// Comments Logic

export const getComments = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        // Verify the project exists
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }

        const comments = await CommentModel.find({ project: projectId })
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ comments });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
};

export const addComment = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const parsedData = Comment.parse(req.body);

        // Verify the project exists
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }

        const comment = await CommentModel.create({
            content: parsedData.content,
            author: req.user.id,
            project: new Types.ObjectId(projectId as string),
        });

        // Populate author details before returning
        await comment.populate("author", "name email");

        return res.status(201).json({
            comment,
            msg: "Comment added successfully",
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ msg: "Input data error" });
        }
        return res.status(500).json({ msg: "Something went wrong" });
    }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
    try {
        const { commentId } = req.params;
        const parsedData = Comment.parse(req.body);

        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        // Only the comment author is allowed to update
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: "403 Forbidden" });
        }

        await CommentModel.updateOne(
            { _id: commentId },
            { $set: { content: parsedData.content } }
        );

        return res.status(200).json({ msg: "Comment updated successfully" });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ msg: "Input data error" });
        }
        return res.status(500).json({ msg: "Something went wrong" });
    }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId, commentId } = req.params;

        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        // Verify the comment actually belongs to the given project
        if (comment.project.toString() !== projectId) {
            return res.status(400).json({ msg: "Comment does not belong to this project" });
        }

        const isCommentAuthor = comment.author.toString() === req.user.id;

        // Project owner is also allowed to delete any comment on their project
        const project = await ProjectModel.findById(projectId).select("owner");
        const isProjectOwner = project?.owner.toString() === req.user.id;

        if (!isCommentAuthor && !isProjectOwner) {
            return res.status(403).json({ msg: "403 Forbidden" });
        }

        await CommentModel.deleteOne({ _id: commentId });

        return res.status(200).json({ msg: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
};