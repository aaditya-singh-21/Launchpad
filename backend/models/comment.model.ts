import mongoose, { Schema } from "mongoose";
import { IComment } from "../Interfaces/comment.interface";

const CommentSchema = new Schema<IComment>({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }
},
    {
        timestamps: true
    })

export const CommentModel = mongoose.model<IComment>("Comment", CommentSchema)