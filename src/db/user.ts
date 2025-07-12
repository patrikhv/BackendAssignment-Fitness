import {DataTypes, Model, Sequelize} from 'sequelize';
import {USER_ROLE} from "../utils/enums";

export interface UserModel extends Model {
    id: number;
    name: string;
    surname: string;
    nickName: string;
    email: string;
    age: number;
    role: USER_ROLE
    password: string
}

export default (sequelize: Sequelize, modelName: string) => {
    return sequelize.define<UserModel>(
        modelName,
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            surname: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            nickName: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING(200),
                allowNull: false,
                unique: true
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 120
                }
            },
            role: {
                type: DataTypes.ENUM(...Object.values(USER_ROLE)),
                allowNull: false
            },
            password: {
                type: DataTypes.STRING(200),
                allowNull: false
            }
        },
        {
            paranoid: true,
            timestamps: true,
            tableName: 'users'
        }
    );
};