import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateInterviewStage } from '../../application/services/candidateService';
import { PrismaClient } from '@prisma/client';
import { findCandidatesByPosition } from '../../application/services/candidateService';

const prisma = new PrismaClient();

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
        const positionId = parseInt(req.params.positionId);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid position ID format' });
        }

        // Verificar si la posición existe
        const positionExists = await prisma.position.findUnique({
            where: { id: positionId }
        });

        if (!positionExists) {
            return res.status(404).json({ error: 'Position not found' });
        }

        const candidates = await findCandidatesByPosition(positionId, page, pageSize);
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStage = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        const { stageId } = req.body;

        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID format' });
        }

        if (!stageId || isNaN(stageId)) {
            return res.status(400).json({ error: 'Invalid stage ID' });
        }

        const result = await updateCandidateInterviewStage(candidateId, stageId);
        
        if (!result) {
            return res.status(404).json({ error: 'Candidate or application not found' });
        }

        res.json({ message: 'Interview stage updated successfully', data: result });
    } catch (error) {
        console.error('Error updating candidate stage:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { addCandidate };
