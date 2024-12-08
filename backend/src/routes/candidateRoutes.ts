import { Router } from 'express';
import { addCandidate, getCandidateById, updateCurrentStage } from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', addCandidate);
router.get('/:id', getCandidateById);
router.put('/:id/stage', updateCurrentStage);

export default router;
