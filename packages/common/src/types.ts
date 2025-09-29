import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string()
});

export const SignInSchema = z.object({
    username: z.string().min(3),
    password: z.string()
});

export const CreateRoomSchema = z.object({
    name: z.string().min(3),
});
