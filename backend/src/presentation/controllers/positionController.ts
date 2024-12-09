import { Request, Response } from 'express';
import { getCandidatesByPositionId } from '../../application/services/positionService';

export const getPositionCandidatesController = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        
        if (isNaN(positionId)) {
            return res.status(400).json({ 
                error: 'El ID de la posición debe ser un número válido' 
            });
        }

        const result = await getCandidatesByPositionId(positionId);
        res.json(result);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'La posición no existe') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
