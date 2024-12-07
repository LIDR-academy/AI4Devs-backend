import { DomainEvent } from './DomainEvent';

type EventHandler = (event: DomainEvent) => Promise<void>;

export class EventDispatcher {
    private handlers: Map<string, EventHandler[]> = new Map();

    subscribe(eventName: string, handler: EventHandler): void {
        const handlers = this.handlers.get(eventName) || [];
        handlers.push(handler);
        this.handlers.set(eventName, handlers);
    }

    async dispatch(event: DomainEvent): Promise<void> {
        const handlers = this.handlers.get(event.eventName) || [];
        await Promise.all(handlers.map(handler => handler(event)));
    }
}
