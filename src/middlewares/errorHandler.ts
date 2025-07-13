import { ErrorRequestHandler } from 'express';
import { AppError } from "../errors/appError";
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (
    err,
    _req,
    res,
    _next
) => {
    if (err instanceof AppError) {
        res.status(err.status).json({ message: err.message });
        return;
    }

    logger.error('[Unhandled Error]', err);
    res.status(500).json({ message: 'Something went wrong' });
};


