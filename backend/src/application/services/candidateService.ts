import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { CandidateDTO } from '../../domain/dto/CandidateDTO';
import { ApplicationError } from '../../domain/errors/ApplicationError';

export class CandidateService {
    constructor(private readonly candidateRepository: ICandidateRepository) {}

    async getCandidatesForPosition(positionId: number): Promise<CandidateDTO[]> {
        try {
            return await this.candidateRepository.getCandidatesForPosition(positionId);
        } catch (error) {
            throw new ApplicationError('Error retrieving candidates', error);
        }
    }

    async updateCandidateStage(candidateId: number, stageId: number): Promise<void> {
        const [candidateExists, stageExists] = await Promise.all([
            this.candidateRepository.validateCandidateExists(candidateId),
            this.candidateRepository.validateStageExists(stageId)
        ]);

        if (!candidateExists) {
            throw new ApplicationError('Candidate not found');
        }

        if (!stageExists) {
            throw new ApplicationError('Interview stage not found');
        }

        try {
            await this.candidateRepository.updateCandidateStage(candidateId, stageId);
        } catch (error) {
            throw new ApplicationError('Error updating candidate stage', error);
        }
    }
}
