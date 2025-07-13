import { Sequelize, DataTypes, Model } from 'sequelize'
import {UserModel} from "./user";
import {ExerciseModel} from "./exercise";

export interface UserExerciseModel extends Model {
    id: number;
    user: UserModel;
    exercise: ExerciseModel;
    completedAt: Date;
    duration: number;
}

export default (sequelize: Sequelize, modelName: string) => {
    const UserExerciseModelCtor = sequelize.define<UserExerciseModel>(
        modelName,
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            completedAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            timestamps: true,
            tableName: 'user_exercises'
        }
    );

    UserExerciseModelCtor.associate = (models) => {
        UserExerciseModelCtor.belongsTo(models.User, { foreignKey: 'userId' });
        UserExerciseModelCtor.belongsTo(models.Exercise, { foreignKey: 'exerciseId' });
    };

    return UserExerciseModelCtor;
};

