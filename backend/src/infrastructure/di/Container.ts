import { DIContainer } from './types';

export class Container implements DIContainer {
    private instances = new Map<string, any>();

    get<T>(token: string): T {
        if (!this.instances.has(token)) {
            throw new Error(`No instance registered for token: ${token}`);
        }
        return this.instances.get(token);
    }

    register<T>(token: string, instance: T): void {
        this.instances.set(token, instance);
    }
}