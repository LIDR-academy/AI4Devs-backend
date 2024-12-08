import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PositionRepository {

    async getCandidatesWithActiveApplications(positionId: number) {
        const candidates = await prisma.candidate.findMany({
            where: {
                applications: {
                    some: {
                        positionId: positionId,
                        currentInterviewStep: {
                            not: undefined
                        }
                    }
                }
            },
            select: {
                firstName: true,
                lastName: true,
                applications: {
                    where: {
                        positionId: positionId
                    },
                    select: {
                        currentInterviewStep: true,
                        interviews: {
                            select: {
                                score: true
                            }
                        }
                    }
                }
            }
        });

        return candidates.map(candidate => ({
            fullName: `${candidate.firstName} ${candidate.lastName}`,
            currentInterviewStep: candidate.applications[0].currentInterviewStep,
            averageInterviewScore: candidate.applications[0].interviews.reduce((acc, interview) => acc + (interview.score || 0), 0) / candidate.applications[0].interviews.length
        }));
    }
}
