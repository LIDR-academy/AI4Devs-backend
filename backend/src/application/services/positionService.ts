import { Position } from '../../domain/models/Position';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CandidateStatus {
    fullName: string;
    currentInterviewStep: {
        id: number;
        name: string;
    };
    averageScore: number | null;
}

export class PositionService {
    /**
     * Obtiene los candidatos y su estado para una posición específica
     * @param positionId - ID de la posición
     * @returns Array de candidatos con su estado actual y puntuación media
     */
    static async getCandidatesWithStatus(positionId: number): Promise<CandidateStatus[]> {
        try {
            // Primero verificamos que la posición existe
            const positionExists = await prisma.position.findUnique({
                where: { id: positionId }
            });

            if (!positionExists) {
                throw new Error('Position not found');
            }

            // Obtenemos los candidatos con toda la información necesaria
            const applications = await prisma.application.findMany({
                where: {
                    positionId: positionId
                },
                select: {
                    candidate: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    interviewStep: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    interviews: {
                        select: {
                            score: true
                        }
                    }
                }
            });

            // Transformamos los datos al formato requerido
            return applications.map(app => ({
                fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
                currentInterviewStep: {
                    id: app.interviewStep.id,
                    name: app.interviewStep.name
                },
                averageScore: app.interviews.length > 0
                    ? app.interviews.reduce((acc, interview) => acc + (interview.score || 0), 0) / 
                      app.interviews.filter(interview => interview.score !== null).length
                    : null
            }));

        } catch (error: any) {
            if (error.message === 'Position not found') {
                throw error;
            }
            throw new Error('Error retrieving candidates status');
        }
    }

    /**
     * Verifica si una posición existe
     * @param positionId - ID de la posición a verificar
     * @returns boolean
     */
    static async exists(positionId: number): Promise<boolean> {
        const position = await prisma.position.findUnique({
            where: { id: positionId }
        });
        return !!position;
    }
} 