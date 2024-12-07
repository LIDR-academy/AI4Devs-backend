import { PrismaClient } from '@prisma/client';
import { Container } from './Container';
import { TOKENS } from './types';
import { PrismaApplicationRepository } from '../repositories/PrismaApplicationRepository';
import { StageValidationService } from '../../application/services/StageValidationService';
import { EventDispatcher } from '../../domain/events/EventDispatcher';
import { StageNotificationService } from '../../application/services/StageNotificationService';

export function setupContainer(): Container {
    const container = new Container();
    
    // Register instances
    const prisma = new PrismaClient();
    container.register(TOKENS.PrismaClient, prisma);
    container.register(TOKENS.ApplicationRepository, new PrismaApplicationRepository(prisma));
    container.register(TOKENS.StageValidator, new StageValidationService());
    container.register(TOKENS.EventDispatcher, new EventDispatcher());
    container.register(TOKENS.NotificationService, new StageNotificationService());
    
    return container;
}