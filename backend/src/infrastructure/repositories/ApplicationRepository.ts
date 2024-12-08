import prisma from '../../prismaClient';
import { Application } from '../../domain/models/Application';

export class ApplicationRepository {
    async save(application: Application): Promise<Application> {
        if (application.id) {
            const updatedApplication = await prisma.application.update({
                where: { id: application.id },
                data: {
                    positionId: application.positionId,
                    candidateId: application.candidateId,
                    applicationDate: application.applicationDate,
                    currentInterviewStep: application.currentInterviewStep,
                    notes: application.notes
                }
            });
            return new Application(updatedApplication);
        } else {
            const createdApplication = await prisma.application.create({
                data: {
                    positionId: application.positionId,
                    candidateId: application.candidateId,
                    applicationDate: application.applicationDate,
                    currentInterviewStep: application.currentInterviewStep,
                    notes: application.notes
                }
            });
            return new Application(createdApplication);
        }
    }

    async findByPositionId(positionId: number): Promise<Application[]> {
        const applications = await prisma.application.findMany({
            where: { positionId }
        });
        return applications.map(app => new Application(app));
    }

    async findByCandidateId(candidateId: number): Promise<Application | null> {
        const application = await prisma.application.findFirst({
            where: { candidateId }
        });
        return application ? new Application(application) : null;
    }

    async update(application: Application): Promise<void> {
        await prisma.application.update({
            where: { id: application.id },
            data: {
                currentInterviewStep: application.currentInterviewStep,
                notes: application.notes
            }
        });
    }
} 