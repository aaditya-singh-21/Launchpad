import * as z from "zod"

export const Comment = z.object({
    content : z.string().min(3, {message : "Comment should be minimum 3 characters"})
});