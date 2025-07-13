import z from "zod";

export const UserExerciseRequestSchema = z.object({
    completedAt: z.date(),
    duration: z.number().int().positive("Duration must be a positive integer")
});

export type UserExerciseRequest = z.infer<typeof UserExerciseRequestSchema>;