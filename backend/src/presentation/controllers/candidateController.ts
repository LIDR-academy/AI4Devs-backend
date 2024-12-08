import { Request, Response } from 'express';
import { CandidateService } from '../../application/services/candidateService';
import { CandidateRepository } from '../../infrastructure/repositories/CandidateRepository';

const candidateRepository = new CandidateRepository();
const candidateService = new CandidateService(candidateRepository);

export const addCandidate = async (req: Request, res: Response) => {
    try {
        const candidate = await candidateService.addCandidate(req.body);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
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

export const updateCurrentStage = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        const { newStageId } = req.body;

        if (isNaN(candidateId) || isNaN(newStageId)) {
            return res.status(400).json({ error: 'Invalid candidate ID or stage ID format' });
        }

        await candidateService.updateCurrentStage(candidateId, newStageId);
        res.status(200).json({ message: 'Candidate stage updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
