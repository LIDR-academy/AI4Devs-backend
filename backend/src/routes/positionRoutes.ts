import { Router } from 'express';
import { getCandidatesByPosition } from '../presentation/controllers/candidateController';

const router = Router();

router.get('/:positionId/candidates', getCandidatesByPosition);

export default router; 