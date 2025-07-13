import {models} from "../db";
import {NotFoundError, ValidationError} from "../errors/appError";

const { Exercise, Program } = models;

export class ProgramService {

    static async addExerciseToProgram(exerciseId: number, programId: number) {
        const exercise = await Exercise.findByPk(exerciseId);
        if (!exercise) {
            throw new NotFoundError('Exercise not found');
        }

        if (exercise.program !== null) {
            // throw with info that exercise is already assigned to a program - with names
            throw new ValidationError(`Exercise ${exercise.name} is already assigned to a program., please remove it from the current program before adding it to another one.`);
        }

        const program = await Program.findByPk(programId);
        if (!program) {
            throw new Error('Program not found');
        }

        exercise.program = program;
        return await exercise.save();
    }

    static async removeExerciseFromProgram(exerciseId: number, programId: number) {
        const exercise = await Exercise.findByPk(exerciseId);
        if (!exercise) {
            throw new NotFoundError('Exercise not found');
        }

        if (exercise.program?.id !== programId) {
            throw new ValidationError(`Exercise ${exercise.name} is not assigned to program with ID ${programId}.`);
        }

        exercise.program = null;
        return await exercise.save();
    }
}
