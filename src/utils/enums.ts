import z from "zod";

export enum EXERCISE_DIFFICULTY {
	EASY = 'EASY',
	MEDIUM = 'MEDIUM',
	HARD = 'HARD'
}

export enum USER_ROLE {
	ADMIN = 'ADMIN',
	USER = 'USER'
}

export const UserRoleSchema = z.enum(USER_ROLE);

export const ExerciseDifficultySchema = z.enum(EXERCISE_DIFFICULTY);