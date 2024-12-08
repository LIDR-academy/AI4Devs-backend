import { Request, Response } from 'express';
import { CandidateService } from '../../application/services/candidateService';
import { CandidateRepository } from '../../infrastructure/repositories/CandidateRepository';
import { ApplicationRepository } from '../../infrastructure/repositories/ApplicationRepository';
import { InterviewRepository } from '../../infrastructure/repositories/InterviewRepository';

const candidateService = new CandidateService(
    new CandidateRepository(),
    new ApplicationRepository(),
    new InterviewRepository()
);

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await candidateService.addCandidate(candidateData);
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
        const candidate = await candidateService.findCandidateById(id);
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
        const candidates = await candidateService.getCandidatesByPositionService(positionId);
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStage = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        const { newStage } = req.body;

        if (isNaN(candidateId) || !newStage) {
            return res.status(400).json({ error: 'Invalid candidate ID or stage' });
        }

        await candidateService.updateCandidateStageService(candidateId, newStage);
        res.status(200).json({ message: 'Candidate stage updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};