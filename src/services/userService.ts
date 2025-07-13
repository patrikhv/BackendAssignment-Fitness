import bcrypt from 'bcrypt';
import {models} from '../db';
import {generateToken} from '../utils/jwt';
import {AppError, ConflictError, NotFoundError, UnauthorizedError} from "../errors/appError";
import {Op} from "sequelize";
import {USER_ROLE} from "../utils/enums";
import {UserLoginRequest, UserRegistrationRequest, UserRegistrationResponse, UserUpdateRequest} from "../types/user";

const { User } = models;

export class UserService {

    static async register(data: UserRegistrationRequest): Promise<UserRegistrationResponse> {
        const existing = await User.findOne({ where: { email: data.email } });
        if (existing) {
            throw new ConflictError('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await User.create({
            name: data.name,
            surname: data.surname,
            nickName: data.nickName,
            email: data.email,
            age: data.age,
            role: data.role,
            password: hashedPassword
        });

        return {
            id: String(user.id),
            email: user.email,
            role: user.role,
        };
    }

    static async login(data: UserLoginRequest) {

        const user = await User.findOne({ where: { email: data.email } });
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return { token };
    }

    static async getAllForRole(role: USER_ROLE) {
        // if admin return all fields, if user return only id and name
        const users = await User.findAll({
                attributes: ['id', 'name', 'surname', 'nickName', 'email', 'age', 'role']}
        );
        if (role === USER_ROLE.ADMIN) {
            return users.map(user => ({
                id: user.id,
                name: user.name,
                surname: user.surname,
                nickName: user.nickName,
                email: user.email,
                age: user.age,
                role: user.role
            }));
        } else if (role === USER_ROLE.USER) {
            return users.map(user => ({
                id: user.id,
                nickName: user.nickName,
            }));
        } else {
            throw new UnauthorizedError('Not authorized to view users');
        }
    }

    static async getById(id: number, role: USER_ROLE) {
        const user = await User.findByPk(id, {
            attributes: ['id', 'name', 'surname', 'nickName', 'email', 'age', 'role']
        });
        if (!user) {
            throw new AppError('User not found');
        }
        if (role === USER_ROLE.ADMIN) {
            return {
                id: user.id,
                name: user.name,
                surname: user.surname,
                nickName: user.nickName,
                email: user.email,
                age: user.age,
                role: user.role
            };
        } else if (role === USER_ROLE.USER) {
            return {
                name: user.name,
                surname: user.surname,
                age: user.age,
                nickName: user.nickName
            };
        } else {
            throw new UnauthorizedError('Not authorized to view this user');
        }
    }

    static async update(id: number, data: UserUpdateRequest) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (data.email) {
            const existing = await User.findOne({ where: { email: data.email, id: { [Op.ne]: id } } });
            if (existing) {
                throw new ConflictError('Email already in use');
            }
        }

        await user.update(data);

        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            nickName: user.nickName,
            email: user.email,
            age: user.age,
            role: user.role
        };
    }
}
