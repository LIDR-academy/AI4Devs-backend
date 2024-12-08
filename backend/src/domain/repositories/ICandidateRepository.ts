import { CandidateDTO } from '../dto/CandidateDTO';
import { InterviewStageDTO } from '../dto/InterviewStageDTO';

export interface ICandidateRepository {
    getCandidatesForPosition(positionId: number): Promise<CandidateDTO[]>;
    updateCandidateStage(candidateId: number, stageId: number): Promise<void>;
    validateCandidateExists(candidateId: number): Promise<boolean>;
    validateStageExists(stageId: number): Promise<boolean>;
} 