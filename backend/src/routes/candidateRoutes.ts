import { Router } from 'express';
import { addCandidate, getCandidateById } from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', addCandidate);
router.get('/:id', getCandidateById);

export default router;
