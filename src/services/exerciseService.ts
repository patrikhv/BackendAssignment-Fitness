import { models } from '../db';
import {NotFoundError, ValidationError} from "../errors/appError";
import {ExerciseDto} from "../types/exercise";
import {ExerciseQuery} from "../types/ExerciseQuerySchema";
import {Op} from "sequelize";

const { Exercise, Program } = models;

export class ExerciseService {
    static async getAllWithPrograms(query: ExerciseQuery) {
        const { page, limit, programID, search } = query;
        const offset = (page - 1) * limit;

        const whereClause: any = {};

        if (programID) {
            whereClause.programID = programID;
        }

        if (search) {
            whereClause.name = {
                [Op.iLike]: `%${search}%`  // case-insensitive LIKE
            };
        }

        const { rows, count } = await Exercise.findAndCountAll({
            where: whereClause,
            include: [{ model: Program }],
            limit,
            offset
        });

        return {
            entries: rows,
            total: count,
            page,
            perPage: limit
        };
    }

    static async getById(id: number) {
        const exercise = await Exercise.findByPk(id, {
            include: [{ model: Program }]
        });

        if (!exercise) throw new NotFoundError('Exercise not found');

        return exercise;
    }

    static async create(data: ExerciseDto) {
        const { name, description, difficulty, programID } = data;

        if (!name || !description || !difficulty || !programID) {
            throw new ValidationError('Missing required fields');
        }
        const program = await Program.findByPk(programID);

        if (!program) {
            throw new NotFoundError('Program not found');
        }
        return await Exercise.create({ name, description, difficulty, programID });
    }

    static async update(id: number, data: ExerciseDto) {
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

        return await exercise.update({ name, description, difficulty, programID });
    }

    static async delete(id: number) {
        const exercise = await Exercise.findByPk(id);
        if (!exercise) throw new NotFoundError('Exercise not found');

        await exercise.destroy();
    }
}
