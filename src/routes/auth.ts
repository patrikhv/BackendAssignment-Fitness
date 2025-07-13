import { Router, Request, Response, NextFunction } from 'express';
import {UserService} from "../services/userService";
import {validate} from "../middlewares/validate";
import { logger } from '../utils/logger'
import {
    UserLoginRequest,
    UserLoginRequestSchema,
    UserRegistrationRequest,
    UserRegistrationRequestSchema, UserRegistrationResponse
} from "../types/user";

const router = Router();

export default () => {
    // Register
    router.post(
        '/register',
        validate(UserRegistrationRequestSchema),
        async (req: Request<{}, {}, UserRegistrationRequest>, res: Response, next: NextFunction): Promise<void> => {
            try {
                const userData = await UserService.register(req.body);

                logger.info('User registered successfully', { user: userData });
                res.status(201).json({
                    message: 'User registered successfully',
                    data: userData
                });
            } catch (err) {
                next(err);
            }
    });

    // Login
    router.post(
        '/login',
        validate(UserLoginRequestSchema),
        async (req: Request<{}, {}, UserLoginRequest>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = await UserService.login(req.body);

            res.status(200).json({
                message: 'Login successful',
                token
            });
        } catch (err) {
            next(err);
        }
    });

    return router;
};

