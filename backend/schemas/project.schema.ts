import * as z from "zod"

export const Project = z.object({
    title : z.string(),
    description : z.string(),
    techStack : z.array(z.string()),
    githubLink : z.url().optional(),
    livelink : z.url().optional(),
})



export const CreateProject = Project
export const UpdateProject = Project.partial()
