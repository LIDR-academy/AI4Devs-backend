import { PrismaClient } from '@prisma/client';
import { Interview } from './Interview';

const prisma = new PrismaClient();

export class Application {
    id?: number;
    positionId: number;
    candidateId: number;
    applicationDate: Date;
    currentInterviewStep: number;
    notes?: string;
    interviews: Interview[]; // Added this line

    constructor(data: any) {
        this.id = data.id;
        this.positionId = data.positionId;
        this.candidateId = data.candidateId;
        this.applicationDate = new Date(data.applicationDate);
        this.currentInterviewStep = data.currentInterviewStep;
        this.notes = data.notes;
        this.interviews = data.interviews || []; // Added this line
    }

    async save() {
        const applicationData: any = {
            positionId: this.positionId,
            candidateId: this.candidateId,
            applicationDate: this.applicationDate,
            currentInterviewStep: this.currentInterviewStep,
            notes: this.notes,
        };

        if (this.id) {
            return await prisma.application.update({
                where: { id: this.id },
                data: applicationData,
            });
        } else {
            return await prisma.application.create({
                data: applicationData,
            });
        }
    }

    static async findOne(id: number): Promise<Application | null> {
        const data = await prisma.application.findUnique({
            where: { id: id },
        });
        if (!data) return null;
        return new Application(data);
    }

    async updateStage(newStageId: number): Promise<Application> {
        // Validar que la aplicación existe
        const application = await prisma.application.findUnique({
            where: { id: this.id },
            include: {
                position: {
                    include: {
                        interviewFlow: {
                            include: {
                                interviewSteps: true
                            }
                        }
                    }
                }
            }
        });

        if (!application) {
            throw new Error('Application not found');
        }

        // Validar que la nueva etapa pertenece al flujo correcto
        const validStep = application.position.interviewFlow.interviewSteps.find(
            step => step.id === newStageId
        );

        if (!validStep) {
            throw new Error('Invalid interview step for this position');
        }

        // Actualizar la etapa actual
        const updatedApplication = await prisma.application.update({
            where: { id: this.id },
            data: {
                currentInterviewStep: newStageId,
                interviews: {
                    create: {
                        interviewStepId: newStageId,
                        interviewDate: new Date(),
                        score: null,
                        notes: '',
                        employeeId: 1
                    }
                }
            },
            include: {
                interviews: true,
                interviewStep: true
            }
        });

        return new Application(updatedApplication);
    }
}
