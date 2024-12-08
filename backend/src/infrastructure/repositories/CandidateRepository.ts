import { PrismaClient, Prisma } from '@prisma/client';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Candidate } from '../../domain/models/Candidate';

const prisma = new PrismaClient();

export class CandidateRepository implements ICandidateRepository {

    async save(candidate: Candidate): Promise<any> {
        const candidateData: any = {};

        if (candidate.firstName !== undefined) candidateData.firstName = candidate.firstName;
        if (candidate.lastName !== undefined) candidateData.lastName = candidate.lastName;
        if (candidate.email !== undefined) candidateData.email = candidate.email;
        if (candidate.phone !== undefined) candidateData.phone = candidate.phone;
        if (candidate.address !== undefined) candidateData.address = candidate.address;

        if (candidate.education) {
            candidateData.educations = {
                create: candidate.education.map(edu => ({
                    institution: edu.institution,
                    title: edu.title,
                    startDate: edu.startDate,
                    endDate: edu.endDate
                }))
            };
        }

        if (candidate.workExperience) {
            candidateData.workExperiences = {
                create: candidate.workExperience.map(exp => ({
                    company: exp.company,
                    position: exp.position,
                    description: exp.description,
                    startDate: exp.startDate,
                    endDate: exp.endDate
                }))
            };
        }

        if (candidate.resumes) {
            candidateData.resumes = {
                create: candidate.resumes.map(resume => ({
                    filePath: resume.filePath,
                    fileType: resume.fileType
                }))
            };
        }

        if (candidate.applications) {
            candidateData.applications = {
                create: candidate.applications.map(app => ({
                    positionId: app.positionId,
                    candidateId: app.candidateId,
                    applicationDate: app.applicationDate,
                    currentInterviewStep: app.currentInterviewStep,
                    notes: app.notes,
                }))
            };
        }

        if (candidate.id) {
            try {
                return await prisma.candidate.update({
                    where: { id: candidate.id },
                    data: candidateData
                });
            } catch (error: any) {
                console.log(error);
                if (error instanceof Prisma.PrismaClientInitializationError) {
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else if (error.code === 'P2025') {
                    throw new Error('No se pudo encontrar el registro del candidato con el ID proporcionado.');
                } else {
                    throw error;
                }
            }
        } else {
            try {
                return await prisma.candidate.create({
                    data: candidateData
                });
            } catch (error: any) {
                if (error instanceof Prisma.PrismaClientInitializationError) {
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else {
                    throw error;
                }
            }
        }
    }

    async findById(id: number): Promise<Candidate | null> {
        const data = await prisma.candidate.findUnique({
            where: { id: id },
            include: {
                educations: true,
                workExperiences: true,
                resumes: true,
                applications: {
                    include: {
                        position: {
                            select: {
                                id: true,
                                title: true
                            }
                        },
                        interviews: {
                            select: {
                                interviewDate: true,
                                interviewStep: {
                                    select: {
                                        name: true
                                    }
                                },
                                notes: true,
                                score: true
                            }
                        }
                    }
                }
            }
        });
        if (!data) return null;
        return new Candidate(data);
    }

    async updateCurrentStage(candidateId: number, newStageId: number): Promise<void> {
        await prisma.application.updateMany({
            where: {
                candidateId: candidateId,
                currentInterviewStep: {
                    not: null
                }
            },
            data: {
                currentInterviewStep: newStageId
            }
        });
    }
}
