import { models } from '../db';
import { NotFoundError, ValidationError } from '../errors/appError';
import {UserExerciseRequest} from "../types/userExercise";

const { User, Exercise, UserExercise } = models;

export class UserExerciseService {

    static async trackExercise(userId: number, exerciseId: number, data: UserExerciseRequest) {
        const exercise = await Exercise.findByPk(exerciseId);
        if (!exercise) {
            throw new NotFoundError('Exercise not found');
        }

        return await UserExercise.create({
            userId,
            exerciseId,
            completedAt: data.completedAt,
            duration: data.duration
        });
    }

    static async getCompletedExercises(userId: number) {
        return await UserExercise.findAll({
            where: { userId },
            include: [{ model: Exercise }],
            order: [['completedAt', 'DESC']]
        });
    }

    static async removeTrackedExercise(userId: number, trackId: number) {
        const entry = await UserExercise.findOne({
            where: { id: trackId, userId }
        });

        if (!entry) {
            throw new NotFoundError('Tracked exercise not found');
        }

        await entry.destroy();
    }
}
