import bcrypt from 'bcrypt';
import { models } from '../db';
import { generateToken } from '../utils/jwt';
import {AppError, ConflictError, NotFoundError, UnauthorizedError } from "../errors/appError";
import {Op} from "sequelize";

const { User } = models;

export class UserService {

    static async register(data: {
        name: string;
        surname: string;
        nickName: string;
        email: string;
        age: number;
        role: 'ADMIN' | 'USER';
        password: string;
    }) {
        const { name, surname, nickName, email, age, role, password } = data;

        if (!name || !surname || !nickName || !email || !age || !role || !password) {
            throw new AppError('Missing required fields');
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            throw new ConflictError('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            surname,
            nickName,
            email,
            age,
            role,
            password: hashedPassword
        });

        return {
            id: user.id,
            email: user.email,
            role: user.role
        };
    }

    static async login(email: string, password: string) {
        if (!email || !password) {
            throw new AppError('Email and password are required');
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.password);
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

    static async getAll() {
        const users = await User.findAll({
            attributes: ['id', 'name', 'surname', 'nickName', 'email', 'age', 'role']
        });
        return users.map(user => ({
            id: user.id,
            name: user.name,
            surname: user.surname,
            nickName: user.nickName,
            email: user.email,
            age: user.age,
            role: user.role
        }));
    }

    static async getById(id: number) {
        const user = await User.findByPk(id, {
            attributes: ['id', 'name', 'surname', 'nickName', 'email', 'age', 'role']
        });
        if (!user) {
            throw new AppError('User not found');
        }
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

    static async update(id: number, data: {
        name: string;
        surname: string;
        nickName: string;
        email: string;
        age: number;
        role: 'ADMIN' | 'USER';
    }) {
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
