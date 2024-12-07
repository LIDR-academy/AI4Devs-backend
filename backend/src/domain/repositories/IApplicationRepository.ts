import { Application } from '../models/Application';

export interface IApplicationRepository {
    findByCandidate(candidateId: number): Promise<Application | null>;
    updateStage(applicationId: number, newStageId: number): Promise<Application>;
}
