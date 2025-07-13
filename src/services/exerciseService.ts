import { models } from '../db';
import {NotFoundError, ValidationError} from "../errors/appError";
import {ExerciseDTO} from "../types/dto/exercise";

const { Exercise, Program } = models;

export class ExerciseService {
    static async getAllWithPrograms() {
        return await Exercise.findAll({
            include: [{ model: Program }]
        });
    }

    static async getById(id: number) {
        const exercise = await Exercise.findByPk(id, {
            include: [{ model: Program }]
        });

        if (!exercise) throw new NotFoundError('Exercise not found');

        return exercise;
    }

    static async create(data: ExerciseDTO) {
        const { name, description, difficulty, programID } = data;

        if (!name || !description || !difficulty || !programID) {
            throw new ValidationError('Missing required fields');
        }
        const program = await Program.findByPk(programID);

        if (!program) {
            throw new NotFoundError('Program not found');
        }

        return await Exercise.create({ name, description, difficulty, program });
    }

    static async update(id: number, data: ExerciseDTO) {
        const exercise = await Exercise.findByPk(id);
        if (!exercise) throw new NotFoundError('Exercise not found');

        const { name, description, difficulty, programID } = data;
        if (!name || !description || !difficulty || !programID) {
            throw new ValidationError('Missing required fields');
        }
        const program = await Program.findByPk(programID);
        if (!program) {
            throw new NotFoundError('Program not found');
        }

        return await exercise.update({ name, description, difficulty, program });
    }

    static async delete(id: number) {
        const exercise = await Exercise.findByPk(id);
        if (!exercise) throw new NotFoundError('Exercise not found');

        await exercise.destroy();
    }
}
