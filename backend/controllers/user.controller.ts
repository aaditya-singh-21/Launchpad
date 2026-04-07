import { UserModel } from "../models/user.model";
import { Request, Response } from 'express';
import { AuthRequest } from "../Interfaces/auth.interface";
import { User } from "../schemas/user.schema";
import { ZodError } from "zod";


export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const response = await UserModel.findById(req.user.id).select('-password');
        res.json({
            User: response
        })
    } catch (error) {
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}


export const updateMe = async (req: AuthRequest, res: Response) => {
    try {
        const parsedData = User.parse(req.body)
        const { name, bio, tech, socials } = parsedData

        const updateData: {
            name?: string;
            bio?: string;
            tech?: string[];
            socials?: {
                github?: string;
                linkedin?: string;
                portfolio?: string;
            };
        } = {};

        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (tech !== undefined) updateData.tech = tech;
        if (socials !== undefined) {
            updateData.socials = {
                github: socials.github,
                linkedin: socials.linkedin,
                portfolio: socials.portfolio,
            };
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                msg: "No valid fields provided to update"
            })
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                msg: "User not found"
            })
        }

        res.status(200).json({
            user: updatedUser,
            msg: "User updated successfully"
        })
    } catch (error) {
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