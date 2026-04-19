import mongoose, {Schema} from "mongoose";
import { IProject } from "../Interfaces/project.interface";

const ProjectSchema = new Schema<IProject>({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    techStack : [
        {type : String}
    ],
    githubLink : String,
    livelink : String,
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    upvotes : [{
        type: Schema.Types.ObjectId,
        ref : "User",
    }],
    upvoteCount : {
        type : Number,
        default : 0
    }

}, {
    timestamps : true
});

ProjectSchema.index({upvoteCount : -1})

export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema)