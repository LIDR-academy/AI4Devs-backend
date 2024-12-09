import express from 'express';
import { getPositionCandidatesController } from '../presentation/controllers/positionController';

const router = express.Router();

router.get('/:id/candidates', getPositionCandidatesController);

export default router;
