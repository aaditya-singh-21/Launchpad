import { Types } from "mongoose";
import { IUser } from "./user.interface";


export interface IProject {
    title : string,
    description : string,
    techStack : string[],
    livelink? : string,
    githubLink? : string
    owner : Types.ObjectId | IUser,
    upvotes : Types.ObjectId[] | IUser,
    upvoteCount : Number,
    createdAt?: Date,
    updatedAt?: Date
}