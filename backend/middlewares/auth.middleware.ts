import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../Interfaces/auth.interface';

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({
            msg: "Auth token not provided"
        })
    } else {
        const word = token.split(" ")
        const jwtToken = word[1]
        try {
            const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET!)
            req.user = decoded
            next()
        } catch (error) {
            res.status(500).json({
                msg: "Something went wrong"
            })
        }
    }
}