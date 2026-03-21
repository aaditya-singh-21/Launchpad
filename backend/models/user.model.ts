import mongoose, { Schema } from "mongoose";
import { IUser } from "../Interfaces/user.interface";

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    tech : [
        {type: String}
    ],
    socials: {
        github: { type: String },
        linkedin: { type: String },
        portfolio: { type: String }
    }
}, {
    timestamps: true
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);