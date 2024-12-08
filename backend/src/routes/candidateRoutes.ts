import { Router } from 'express';
import { addCandidateController, getCandidateById, getCandidatesByPosition, updateCandidateStage } from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', addCandidateController);
router.get('/:id', getCandidateById);
router.get('/positions/:id/candidates', getCandidatesByPosition);
router.put('/:id/stage', updateCandidateStage);

export default router;
