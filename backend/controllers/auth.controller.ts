import { UserModel } from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Login, Register } from "../schemas/auth.schema";
import { ZodError } from "zod";


export const register = async (req: Request, res: Response) => {
    try {
        const parsedBody = Register.parse(req.body);
        const { name, email, password } = parsedBody
        const normalizedEmail = email.toLowerCase();
        console.log("Dataset recieved")
        const user = await UserModel.findOne(({ email : normalizedEmail }))
        if (!user) {
            const hashed = await bcrypt.hash(password, 10);
            const User = await UserModel.create({
                name: name,
                password: hashed,
                email: normalizedEmail
            })
            console.log("User creation successful")
            const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET!);
            console.log("JWT signed")
            res.status(201).json({ token })
        } else {
            res.status(401).json({
                mag: "User Already exists"
            })
        }

    } catch (error) {
        if(error instanceof ZodError){
            return res.status(400).json({
                msg : "Input data error"
            })
        }
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const parsedBody = Login.parse(req.body);
        const { email, password } = parsedBody
        const normalizedEmail = email.toLowerCase()
        const user = await UserModel.findOne(({ email: normalizedEmail }))
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
                res.status(200).json({ 
                    token,
                    msg : "Logged in successfully"
                 })
            } else {
                res.status(401).json({
                    msg: "Wrong password provided"
                })
            }
        } else {
            res.status(401).json({
                msg: "User not found"
            })

        }
    } catch (error) {
        if(error instanceof ZodError){
            return res.status(400).json({
                msg : "Input data error"
            })
        }
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}