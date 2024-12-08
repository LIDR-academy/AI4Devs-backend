import { Router } from 'express';
import { getCandidatesWithActiveApplications } from '../presentation/controllers/positionController';

const router = Router();

router.get('/:id/candidates', getCandidatesWithActiveApplications);

export default router;