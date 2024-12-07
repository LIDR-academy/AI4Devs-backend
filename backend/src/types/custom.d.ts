import { Request } from 'express';
import { DIContainer } from '../infrastructure/di/Container';

export interface CustomRequest extends Request {
    container: DIContainer;
}