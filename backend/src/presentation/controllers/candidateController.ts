import { Request, Response } from 'express';
import { CandidateService } from '../../application/services/CandidateService';
import { PrismaCandidateRepository } from '../../infrastructure/repositories/PrismaCandidateRepository';
import { ApplicationError } from '../../domain/errors/ApplicationError';

const candidateService = new CandidateService(new PrismaCandidateRepository());

export const getCandidatesByPosition = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid position ID format' });
        }

        const candidates = await candidateService.getCandidatesForPosition(positionId);
        res.json(candidates);
    } catch (error) {
        if (error instanceof ApplicationError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export const updateCandidateStage = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        const { interviewStepId } = req.body;

        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID format' });
        }

        await candidateService.updateCandidateStage(candidateId, interviewStepId);
        
        res.json({
            status: 'success',
            message: 'Candidate\'s interview stage updated successfully.'
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};