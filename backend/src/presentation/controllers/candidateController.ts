import { Request, Response } from 'express';
import { addCandidate, findCandidateById, getCandidatesByPositionService, updateCandidateStageService } from '../../application/services/candidateService';
import { TOKENS } from '../../infrastructure/di/types';
import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { StageValidationService } from '../../application/services/StageValidationService';
import { EventDispatcher } from '../../domain/events/EventDispatcher';
import { CustomRequest } from '../../types/custom';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCandidatesByPosition = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid position ID format' });
        }

        const candidates = await getCandidatesByPositionService(positionId);
        res.status(200).json(candidates);
    } catch (error: unknown) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStage = async (req: Request, res: Response) => {
    try {
        const { container } = req as CustomRequest;
        const candidateId = parseInt(req.params.id);
        const { newStageId } = req.body;

        if (isNaN(candidateId) || !newStageId) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        const applicationRepository = container.get(TOKENS.ApplicationRepository) as IApplicationRepository;
        const stageValidator = container.get(TOKENS.StageValidator) as StageValidationService;
        const eventDispatcher = container.get(TOKENS.EventDispatcher) as EventDispatcher;

        const updatedApplication = await updateCandidateStageService(
            candidateId,
            newStageId,
            applicationRepository,
            stageValidator,
            eventDispatcher
        );

        res.status(200).json(updatedApplication);
    } catch (error: any) {
        console.error('Error details:', error);
        if (error.message.includes('Application not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { addCandidate };