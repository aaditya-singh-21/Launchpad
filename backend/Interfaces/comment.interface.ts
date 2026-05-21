import { Types } from "mongoose";
import { IProject } from "./project.interface";
import { IUser } from "./user.interface";

export interface IComment {
    content: string,
    author: Types.ObjectId | IUser,
    project: Types.ObjectId | IProject,
    createdAt?: Date,
    updatedAt?: Date
}