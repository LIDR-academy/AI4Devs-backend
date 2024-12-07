import { PrismaClient } from '@prisma/client';
import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { Application } from '../../domain/models/Application';

export class PrismaApplicationRepository implements IApplicationRepository {
    constructor(private prisma: PrismaClient) {}

    async findByCandidate(candidateId: number): Promise<Application | null> {
        const application = await this.prisma.application.findFirst({
            where: { candidateId }
        });
        return application ? new Application(application) : null;
    }

    async updateStage(applicationId: number, newStageId: number): Promise<Application> {
        const updated = await this.prisma.application.update({
            where: { id: applicationId },
            data: { currentInterviewStep: newStageId },
            include: { interviews: true }
        });
        return new Application(updated);
    }
}
