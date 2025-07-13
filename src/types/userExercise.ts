import z from "zod";

export const UserExerciseRequestSchema = z.object({
    completedAt: z.iso
        .datetime({message: "Completed at must be a valid ISO date"})
        .transform((val) => new Date(val)),
    duration: z.number().int().positive("Duration must be a positive integer")
});

export type UserExerciseRequest = z.infer<typeof UserExerciseRequestSchema>;