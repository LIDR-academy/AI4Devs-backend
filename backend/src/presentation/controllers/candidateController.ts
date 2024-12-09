import { Request, Response } from 'express';
import { addCandidate, findCandidateById, getCandidatesByPositionId, updateCandidateStageById } from '../../application/services/candidateService';

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
    const positionId = parseInt(req.params.id, 10);
    if (isNaN(positionId)) {
        return res.status(400).json({ error: 'Invalid position ID' });
    }

    try {
        const candidates = await getCandidatesByPositionId(positionId);
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateCandidateStage = async (req: Request, res: Response) => {
    const candidateId = parseInt(req.params.id, 10);
    const { stage } = req.body;

    if (isNaN(candidateId)) {
        return res.status(400).json({ error: 'Invalid candidate ID' });
    }

    try {
        const updatedCandidate = await updateCandidateStageById(candidateId, stage);
        res.json(updatedCandidate);
    } catch (error) {
        console.error('Error updating candidate stage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { addCandidate };