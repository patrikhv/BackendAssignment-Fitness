import z from "zod"
import {UserRoleSchema} from "../utils/enums";

export const UserRegistrationRequestSchema = z.object({
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    nickName: z.string().min(1, "Nickname is required"),
    email: z.email("Invalid email format"),
    age: z.number().int().positive("Age must be a positive integer"),
    role: UserRoleSchema,
    password: z.string().min(6, "Password must be at least 6 characters long")
})

export type UserRegistrationRequest = z.infer<typeof UserRegistrationRequestSchema>

export const UserUpdateRequestSchema = z.object({
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    nickName: z.string().min(1, "Nickname is required"),
    email: z.email("Invalid email format"),
    age: z.number().int().positive("Age must be a positive integer"),
    role: UserRoleSchema
})

export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>

export const UserRegistrationResponseSchema = z.object({
    id: z.string(),
    email: z.email(),
    role: UserRoleSchema
})

export type UserRegistrationResponse = z.infer<typeof UserRegistrationResponseSchema>

export const UserLoginRequestSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string()
})

export type UserLoginRequest = z.infer<typeof UserLoginRequestSchema>