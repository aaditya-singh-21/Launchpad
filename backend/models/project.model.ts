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
    }

}, {
    timestamps : true
});

export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema)