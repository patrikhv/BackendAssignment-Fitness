import {ExerciseDifficultySchema} from "../utils/enums";
import z from "zod";

export const ExerciseDtoSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: ExerciseDifficultySchema,
    programID: z.string().refine(val => !isNaN(Number(val)), {
        message: "Program ID must be a valid number"
    }).optional(),
})

export type ExerciseDto = z.infer<typeof ExerciseDtoSchema>;