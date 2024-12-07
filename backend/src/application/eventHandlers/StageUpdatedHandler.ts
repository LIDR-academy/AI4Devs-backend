import { StageUpdatedEvent } from '../../domain/events/StageUpdatedEvent';
import { StageNotificationService } from '../services/StageNotificationService';

export class StageUpdatedHandler {
    constructor(private StageNotificationService: StageNotificationService) {}

    async handle(event: StageUpdatedEvent): Promise<void> {
        await this.StageNotificationService.notifyStageChange(
            event.applicationId,
            event.previousStage.getValue(),
            event.newStage.getValue()
        );
    }
}
