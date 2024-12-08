import { PrismaClient } from '@prisma/client';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { CandidateDTO } from '../../domain/dto/CandidateDTO';

export class PrismaCandidateRepository implements ICandidateRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getCandidatesForPosition(positionId: number): Promise<CandidateDTO[]> {
        const candidates = await this.prisma.application.findMany({
            where: { positionId },
            select: {
                candidate: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                interviewStep: {
                    select: { name: true }
                },
                interviews: {
                    select: { score: true }
                }
            }
        });

        return candidates.map(app => {
            const scores = app.interviews
                .map(interview => interview.score)
                .filter((score): score is number => score !== null);
                
            const averageScore = scores.length > 0
                ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
                : null;

            return {
                full_name: `${app.candidate.firstName} ${app.candidate.lastName}`,
                current_interview_step: app.interviewStep.name,
                average_score: averageScore
            };
        });
    }

    async updateCandidateStage(candidateId: number, stageId: number): Promise<void> {
        await this.prisma.application.updateMany({
            where: { candidateId },
            data: { currentInterviewStep: stageId }
        });
    }

    async validateCandidateExists(candidateId: number): Promise<boolean> {
        const candidate = await this.prisma.candidate.findUnique({
            where: { id: candidateId }
        });
        return candidate !== null;
    }

    async validateStageExists(stageId: number): Promise<boolean> {
        const stage = await this.prisma.interviewStep.findUnique({
            where: { id: stageId }
        });
        return stage !== null;
    }
} 