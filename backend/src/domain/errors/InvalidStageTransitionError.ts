import { DomainError } from './DomainError';

export class InvalidStageTransitionError extends DomainError {
    constructor(currentStage: number, newStage: number) {
        super(`Invalid transition from stage ${currentStage} to ${newStage}`);
        this.name = 'InvalidStageTransitionError';
    }
}
