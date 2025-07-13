import { Router, Request, Response, NextFunction } from 'express';
import {UserService} from "../services/userService";

const router = Router();

export default () => {
    // Register
    router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData = await UserService.register(req.body);

            res.status(201).json({
                message: 'User registered successfully',
                data: userData
            });
        } catch (err) {
            next(err); // Pass the error to the error handler
        }
    });

    // Login
    router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = await UserService.login(req.body.email, req.body.password);

            res.status(200).json({
                message: 'Login successful',
                token
            });
        } catch (err) {
            next(err); // Pass the error to the error handler
        }
    });

    return router;
};

