
import { Request, Response, NextFunction, ErrorRequestHandler  } from 'express';
import { CustomError } from '../errors/CustomError';

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
        return next();
    } else (res.status(err.statusCode).json({ message: "diiiiiiiiii" }));

    // Generic error if it's not a custom one
    res.status(500).json({
        message: 'Internal server error',
        error: err.message || 'Something went wrong',
    });
    return next();
};
