import { Request, Response, NextFunction } from 'express';
import { ValidationError, DatabaseError, NotFoundError } from '../errors/CustomErrors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
    }

    if (err instanceof DatabaseError) {
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }

    if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    // Log the error for further analysis
    console.error(err);

    // Default to 500 server error
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
}; 