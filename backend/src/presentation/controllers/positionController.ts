import { Request, Response } from 'express';
import { getPositionCandidates } from '../../application/services/positionService';

export const getPositionCandidatesController = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid position ID format' });
        }

        const result = await getPositionCandidates(positionId);
        res.json(result);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
}; 