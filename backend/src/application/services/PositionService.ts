import { PositionRepository } from '../../infrastructure/repositories/PositionRepository';

export class PositionService {
    private positionRepository: PositionRepository;

    constructor(positionRepository: PositionRepository) {
        this.positionRepository = positionRepository;
    }

    async getCandidatesWithActiveApplications(positionId: number) {
        return await this.positionRepository.getCandidatesWithActiveApplications(positionId);
    }
}
