export interface DIContainer {
    get<T>(token: string): T;
    register<T>(token: string, instance: T): void;
}

export const TOKENS = {
    PrismaClient: 'PrismaClient',
    ApplicationRepository: 'ApplicationRepository',
    StageValidator: 'StageValidator',
    EventDispatcher: 'EventDispatcher',
    NotificationService: 'NotificationService'
} as const;