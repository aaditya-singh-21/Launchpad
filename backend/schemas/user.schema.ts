import * as z from "zod"

export const User = z.object({
    name : z.string().min(3).optional(),
    email : z.string().email().optional(),
    password : z.string().min(6).regex(/.*[!@#$%^&*].*/).optional(),
    tech : z.array(z.string()).optional(),
    bio : z.string().optional(),
    socials : z.object({
        github : z.string().url().optional(),
        linkedin : z.string().url().optional(),
        portfolio : z.string().url().optional(),
    }).optional(),
})