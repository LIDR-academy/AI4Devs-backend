import { Request, Response } from 'express';
import { addCandidate, findCandidateById,getCandidatesForPosition,updateCandidateStageService } from '../../application/services/candidateService';

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
      const { id: positionId } = req.params;
      const candidates = await getCandidatesForPosition(parseInt(positionId)); // Service call
      res.status(200).json(candidates);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving candidates' });
    }
  };

  export const updateCandidateStage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { currentInterviewStep } = req.body;
  
    if (!currentInterviewStep) {
      return res.status(400).json({ message: 'currentInterviewStep is required' });
    }
  
    try {
      const updatedCandidate = await updateCandidateStageService(Number(id), currentInterviewStep);
      res.status(200).json(updatedCandidate);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating candidate stage' });
    }
  };
  
export { addCandidate  };