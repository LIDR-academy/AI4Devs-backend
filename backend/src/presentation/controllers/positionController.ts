import { Request, Response } from 'express';
import { PositionService } from '../../application/services/PositionService';
import { PositionRepository } from '../../infrastructure/repositories/PositionRepository';

const positionRepository = new PositionRepository();
const positionService = new PositionService(positionRepository);

export const getCandidatesWithActiveApplications = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid position ID format' });
        }

        const candidates = await positionService.getCandidatesWithActiveApplications(positionId);
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
