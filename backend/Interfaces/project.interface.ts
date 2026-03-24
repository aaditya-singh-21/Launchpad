import { Types } from "mongoose";
import { IUser } from "./user.interface";


export interface IProject {
    title : String,
    description : String,
    techStack : String[],
    livelink? : String,
    githubLink? : String
    owner : Types.ObjectId | IUser,
    createdAt : Date,
    updatedAt : Date
}