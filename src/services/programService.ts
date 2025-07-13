import {models} from "../db";


const { Exercise, Program } = models;

export class ProgramService {

    static async addExerciseToProgram(exerciseId: number, programId: number) {
        // TODO: Implement logic to add an exercise to a program
    }

    static async removeExerciseFromProgram(exerciseId: number, programId: number) {
        // TODO: Implement logic to remove an exercise from a program

        // TODO: Unable to remove exercise from program, FK is not nullable for now
        // TODO: Maybe change the relationship to many-to-many in the database

    }
}
