import { PrismaClient } from '@prisma/client';
import { IApplicationRepository, ApplicationCreateData } from '../../domain/repositories/IApplicationRepository';
import { Application } from '../../domain/models/Application';

export class PrismaApplicationRepository implements IApplicationRepository {
    constructor(private prisma: PrismaClient) {}

    async findByCandidate(candidateId: number): Promise<Application | null> {
        const application = await this.prisma.application.findFirst({
            where: { candidateId },
            include: { interviews: true }
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

    async findByPosition(positionId: number): Promise<Application[]> {
        const applications = await this.prisma.application.findMany({
            where: { positionId },
            include: {
                candidate: true,
                interviews: true
            }
        });
        return applications.map(app => new Application(app));
    }

    async create(data: ApplicationCreateData): Promise<Application> {
        const application = await this.prisma.application.create({
            data,
            include: { interviews: true }
        });
        return new Application(application);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.application.delete({
            where: { id }
        });
    }
}