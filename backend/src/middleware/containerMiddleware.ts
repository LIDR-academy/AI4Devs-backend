import { Request, Response, NextFunction } from 'express';
import { Container } from '../infrastructure/di/Container';

export const injectContainer = (container: Container) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        (req as any).container = container;
        next();
    };
};