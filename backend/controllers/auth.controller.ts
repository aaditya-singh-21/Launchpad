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

export const googleAuth = async (req: Request, res: Response) => {
    const clientId = process.env.CLIENT_ID;
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    
    let redirectUri = `${protocol}://${host}/api/auth/google/callback`;
    if (host?.includes('localhost')) {
        redirectUri = `http://localhost:5000/api/auth/google/callback`;
    }

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.append("client_id", clientId!);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", "email profile");
    authUrl.searchParams.append("access_type", "online");

    res.redirect(authUrl.toString());
};

export const googleAuthCallback = async (req: Request, res: Response) => {
    const host = req.get('host');
    let frontendUrl = "https://launchpad-kappa-nine.vercel.app";
    if (host?.includes('localhost')) {
        frontendUrl = "http://localhost:5173";
    }

    try {
        const { code } = req.query;
        if (!code) {
            console.error("Authorization code missing");
            return res.redirect(`${frontendUrl}/signin?error=auth_code_missing`);
        }

        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        
        let redirectUri = `${protocol}://${host}/api/auth/google/callback`;
        if (host?.includes('localhost')) {
            redirectUri = `http://localhost:5000/api/auth/google/callback`;
        }

        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: clientId!,
                client_secret: clientSecret!,
                code: code as string,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }).toString()
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Token exchange failed:", tokenData);
            return res.redirect(`${frontendUrl}/signin?error=oauth_failed`);
        }

        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const userInfo = await userInfoResponse.json();

        if (!userInfoResponse.ok) {
            console.error("User info failed:", userInfo);
            return res.redirect(`${frontendUrl}/signin?error=oauth_failed`);
        }

        const normalizedEmail = userInfo.email.toLowerCase();
        let user = await UserModel.findOne({ email: normalizedEmail });

        if (!user) {
            user = await UserModel.create({
                name: userInfo.name || "Google User",
                email: normalizedEmail,
                googleId: userInfo.id,
                avatar: userInfo.picture,
            });
            console.log("New user created via Google OAuth");
        } else {
            if (!user.googleId) {
                user.googleId = userInfo.id;
                user.avatar = user.avatar || userInfo.picture;
                await user.save();
                console.log("Existing user updated with Google OAuth info");
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);

        res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
        console.error("Google OAuth Callback Error:", error);
        res.redirect(`${frontendUrl}/signin?error=server_error`);
    }
};