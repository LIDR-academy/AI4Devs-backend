import { Router } from 'express';
import { addCandidateController, getCandidateById, getCandidatesByPositionIdController, updateCandidateStageController } from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', addCandidateController);

router.get('/:id', getCandidateById);

router.get('/positions/:id/candidates', getCandidatesByPositionIdController);

router.put('/:id/stage', updateCandidateStageController);

export default router;
