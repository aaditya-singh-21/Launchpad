import { UserModel } from "../models/user.model";
import { Request, Response } from 'express';
import { AuthRequest } from "../Interfaces/auth.interface";


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