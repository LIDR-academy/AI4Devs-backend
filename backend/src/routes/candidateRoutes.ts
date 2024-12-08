import { Router } from 'express';
import {
  addCandidate,
  getCandidateById,
  getCandidatesByPosition,
  updateCandidateStage 
} from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await addCandidate(req.body);
    res.status(201).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: "Ocurrió un error inesperado" });
    }
  }
});

router.get('/:id', getCandidateById);
router.get('/position/:id/candidates', getCandidatesByPosition);
router.put('/:id/stage', updateCandidateStage);

export default router;
