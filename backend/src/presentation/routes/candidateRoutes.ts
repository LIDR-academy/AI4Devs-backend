import { Router } from 'express';
import { addCandidateController, getCandidateByIdController, updateCandidateStageController } from '../controllers/candidateController';

const router = Router();

router.post('/', addCandidateController);

router.get('/:id', getCandidateByIdController);

router.put('/:id/stage', updateCandidateStageController);

export default router; 