import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateStage as updateCandidateStageService } from '../../application/services/candidateService';

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

export const updateCandidateStage = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        const { currentInterviewStepId } = req.body;

        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'ID de candidato inválido' });
        }

        if (!currentInterviewStepId || isNaN(parseInt(currentInterviewStepId))) {
            return res.status(400).json({ error: 'ID de etapa de entrevista inválido' });
        }

        const updatedCandidate = await updateCandidateStageService(candidateId, parseInt(currentInterviewStepId));

        if (!updatedCandidate) {
            return res.status(404).json({ error: 'Candidato no encontrado' });
        }

        res.json({ message: 'Etapa actualizada exitosamente', data: updatedCandidate });
    } catch (error: any) {
        if (error.message === 'La posición no existe') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export { addCandidate };