import {EXERCISE_DIFFICULTY} from "../../utils/enums";

export interface ExerciseDTO {
    name: string;
    description: string;
    difficulty: EXERCISE_DIFFICULTY;
    programID: number;
}

