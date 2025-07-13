import { Request, Response, NextFunction } from 'express';
import {USER_ROLE} from "../utils/enums";
import {ForbiddenError} from "../errors/appError";

export const requireRole = (role: USER_ROLE) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as any;
        if (!user || user.role !== role) {
            throw new ForbiddenError("You do not have permission to access this resource");
        }
        next();
    };
};