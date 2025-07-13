import { Request, Response, NextFunction } from 'express';
import z from 'zod';

export const validate =
    (schema: z.ZodSchema<any>, source: 'body' | 'query' | 'params' = 'body') =>
        (req: Request, res: Response, next: NextFunction): void => {
            const result = schema.safeParse(req[source]);

            if (!result.success) {
                res.status(400).json({
                    message: 'Validation failed',
                    data: z.treeifyError(result.error),
                });
                return;
            }
            if (source === 'query') {
                Object.assign(req.query, result);
            } else {
                req[source] = result.data;
            }
            next();
        };
