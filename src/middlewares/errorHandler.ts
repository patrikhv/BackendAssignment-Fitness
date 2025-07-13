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

    // Handle invalid JSON format errors
    if (err instanceof SyntaxError) {
        res.status(400).json({ message: 'Invalid JSON format' });
        return;
    }

    logger.error('[Unhandled Error]', err);
    console.error(err)
    res.status(500).json({ message: 'Something went wrong' });
};


