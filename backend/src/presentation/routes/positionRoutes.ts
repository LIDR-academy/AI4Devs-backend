import { Router } from 'express';
import { PositionController } from '../controllers/positionController';

const router = Router();

/**
 * @swagger
 * /positions/{id}/candidates:
 *   get:
 *     summary: Obtiene todos los candidatos y su estado para una posición específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la posición
 *     responses:
 *       200:
 *         description: Lista de candidatos con su estado actual y puntuación media
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fullName:
 *                         type: string
 *                         description: Nombre completo del candidato
 *                       currentInterviewStep:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       averageScore:
 *                         type: number
 *                         nullable: true
 *                         description: Puntuación media de las entrevistas
 *       400:
 *         description: ID de posición inválido
 *       404:
 *         description: Posición no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id/candidates', PositionController.getCandidatesWithStatus);

export default router; 