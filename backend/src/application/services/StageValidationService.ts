import { InterviewStage } from '../../domain/valueObjects/InterviewStage';

export class StageValidationService {
    async validateStageTransition(currentStageId: number, newStageId: number): Promise<boolean> {
        const currentStage = InterviewStage.fromExisting(currentStageId);
        const newStage = InterviewStage.create(newStageId);

        if (!currentStage.canTransitionTo(newStage)) {
            throw new Error(`Invalid transition from stage ${currentStageId} to ${newStageId}`);
        }

        return true;
    }
}
