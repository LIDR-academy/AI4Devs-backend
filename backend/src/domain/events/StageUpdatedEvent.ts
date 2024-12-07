import { DomainEvent } from './DomainEvent';
import { InterviewStage } from '../valueObjects/InterviewStage';

export class StageUpdatedEvent implements DomainEvent {
    public readonly occurredOn: Date;
    public readonly eventName: string = 'StageUpdated';

    constructor(
        public readonly applicationId: number,
        public readonly candidateId: number,
        public readonly previousStage: InterviewStage,
        public readonly newStage: InterviewStage
    ) {
        this.occurredOn = new Date();
    }
}
