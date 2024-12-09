import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPositionCandidates = async (positionId: number) => {
    try {
        const applications = await prisma.application.findMany({
            where: {
                positionId: positionId
            },
            include: {
                candidate: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                interviewStep: {
                    select: {
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

        const candidates = applications.map(application => {
            // Calcular score medio
            const scores = application.interviews.map(interview => interview.score || 0);
            const averageScore = scores.length > 0 
                ? scores.reduce((a, b) => a + b, 0) / scores.length 
                : 0;

            return {
                fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
                currentStep: application.interviewStep.name,
                averageScore: Number(averageScore.toFixed(2))
            };
        });

        return { candidates };
    } catch (error) {
        console.error('Error fetching position candidates:', error);
        throw new Error('Error retrieving candidates for this position');
    }
}; 