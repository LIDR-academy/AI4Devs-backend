import { Request, Response } from 'express';
import { PositionService } from '../../application/services/positionService';

export class PositionController {
    /**
     * Obtiene todos los candidatos y su estado para una posición específica
     * @param req Request - Debe incluir el ID de la posición en los parámetros
     * @param res Response
     */
    static async getCandidatesWithStatus(req: Request, res: Response) {
        try {
            const positionId = parseInt(req.params.id);

            // Validar que el ID es un número válido
            if (isNaN(positionId)) {
                return res.status(400).json({
                    error: 'Invalid position ID format'
                });
            }

            // Verificar que la posición existe
            const positionExists = await PositionService.exists(positionId);
            if (!positionExists) {
                return res.status(404).json({
                    error: 'Position not found'
                });
            }

            // Obtener los candidatos y su estado
            const candidates = await PositionService.getCandidatesWithStatus(positionId);

            return res.status(200).json({
                data: candidates
            });

        } catch (error: any) {
            console.error('Error in getCandidatesWithStatus:', error);
            
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            });
        }
    }
} 