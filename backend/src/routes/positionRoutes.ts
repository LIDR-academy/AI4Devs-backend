import { Router } from 'express';
import { getCandidatesByPosition } from '../presentation/controllers/candidateController';

const router = Router();

router.get('/:id/candidates', getCandidatesByPosition);

export default router;