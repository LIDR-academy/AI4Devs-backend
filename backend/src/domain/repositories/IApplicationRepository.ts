import { Application } from '../models/Application';

export interface IApplicationRepository {
    findByCandidate(candidateId: number): Promise<Application | null>;
    updateStage(applicationId: number, newStageId: number): Promise<Application>;
    findByPosition(positionId: number): Promise<Application[]>;
    create(data: ApplicationCreateData): Promise<Application>;
    delete(id: number): Promise<void>;
}

export interface ApplicationCreateData {
    positionId: number;
    candidateId: number;
    currentInterviewStep: number;
    applicationDate: Date;
}
