import { z } from 'zod';

export const ExerciseQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    programID: z.coerce.number().int().positive().optional(),
    search: z.string().trim().optional()
});

export type ExerciseQuery = z.infer<typeof ExerciseQuerySchema>;