import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { models } from '../db';
import { generateToken } from '../utils/jwt';

const router = Router();
const { User } = models;

export default () => {
    // Register
    router.post('/register', async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        const { name, surname, nickName, email, age, role, password } = req.body;

        if (!name || !surname || !nickName || !email || !age || !role || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
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

        return res.status(201).json({
            message: 'User registered successfully',
            data: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    });

    // Login
    router.post('/login', async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return res.status(200).json({
            message: 'Login successful',
            token
        });
    });

    return router;
};

