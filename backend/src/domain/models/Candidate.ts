import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { Education } from './Education';
import { WorkExperience } from './WorkExperience';
import { Resume } from './Resume';
import { Application } from './Application';

const prisma = new PrismaClient();

export class Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    education: Education[];
    workExperience: WorkExperience[];
    resumes: Resume[];
    applications: Application[];

    constructor(data: any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phone = data.phone;
        this.address = data.address;
        this.education = data.education || [];
        this.workExperience = data.workExperience || [];
        this.resumes = data.resumes || [];
        this.applications = data.applications || [];
    }

    async save() {
        const candidateData: any = {};

        // Solo añadir al objeto candidateData los campos que no son undefined
        if (this.firstName !== undefined) candidateData.firstName = this.firstName;
        if (this.lastName !== undefined) candidateData.lastName = this.lastName;
        if (this.email !== undefined) candidateData.email = this.email;
        if (this.phone !== undefined) candidateData.phone = this.phone;
        if (this.address !== undefined) candidateData.address = this.address;

        // Añadir educations si hay alguna para añadir
        if (this.education.length > 0) {
            candidateData.educations = {
                create: this.education.map(edu => ({
                    institution: edu.institution,
                    title: edu.title,
                    startDate: edu.startDate,
                    endDate: edu.endDate
                }))
            };
        }

        // Añadir workExperiences si hay alguna para añadir
        if (this.workExperience.length > 0) {
            candidateData.workExperiences = {
                create: this.workExperience.map(exp => ({
                    company: exp.company,
                    position: exp.position,
                    description: exp.description,
                    startDate: exp.startDate,
                    endDate: exp.endDate
                }))
            };
        }

        // Añadir resumes si hay alguno para añadir
        if (this.resumes.length > 0) {
            candidateData.resumes = {
                create: this.resumes.map(resume => ({
                    filePath: resume.filePath,
                    fileType: resume.fileType
                }))
            };
        }

        // Añadir applications si hay alguna para añadir
        if (this.applications.length > 0) {
            candidateData.applications = {
                create: this.applications.map(app => ({
                    positionId: app.positionId,
                    candidateId: app.candidateId,
                    applicationDate: app.applicationDate,
                    currentInterviewStep: app.currentInterviewStep,
                    notes: app.notes,
                }))
            };
        }

        if (this.id) {
            // Actualizar un candidato existente
            try {
                return await prisma.candidate.update({
                    where: { id: this.id },
                    data: candidateData
                });
            } catch (error: any) {
                console.log(error);
                if (error instanceof PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else if (error.code === 'P2025') {
                    // Record not found error
                    throw new Error('No se pudo encontrar el registro del candidato con el ID proporcionado.');
                } else {
                    throw error;
                }
            }
        } else {
            // Crear un nuevo candidato
            try {
                const result = await prisma.candidate.create({
                    data: candidateData
                });
                return result;
            } catch (error: any) {
                if (error instanceof PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else {
                    throw error;
                }
            }
        }
    }

    async updateInterviewStage(stageId: number): Promise<Application | null> {
        try {
            // Encontrar la aplicación activa del candidato
            const application = await prisma.application.findFirst({
                where: { 
                    candidateId: this.id,
                    // Puedes agregar condiciones adicionales aquí si es necesario
                    // como status !== 'CLOSED'
                }
            });

            if (!application) {
                return null;
            }

            // Actualizar la aplicación con la nueva etapa
            const updatedApplication = await prisma.application.update({
                where: { id: application.id },
                data: { 
                    currentInterviewStep: stageId,
                    // Puedes agregar campos adicionales aquí
                    // como lastUpdated: new Date()
                },
                include: {
                    interviews: true,
                    position: true
                }
            });

            // Actualizar la aplicación en la lista de aplicaciones del candidato
            const applicationIndex = this.applications.findIndex(app => app.id === application.id);
            if (applicationIndex !== -1) {
                this.applications[applicationIndex] = new Application(updatedApplication);
            }

            return new Application(updatedApplication);
        } catch (error) {
            console.error('Error updating interview stage:', error);
            throw error;
        }
    }

    static async findOne(id: number): Promise<Candidate | null> {
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

    static async findByPosition(
        positionId: number,
        skip: number,
        take: number
    ): Promise<[Array<{
        currentInterviewStep: number;
        candidate: {
            firstName: string;
            lastName: string;
        };
        interviews: Array<{
            score: number | null;
        }>;
    }>, number]> {
        const [candidates, total] = await Promise.all([
            prisma.application.findMany({
                where: {
                    positionId: positionId
                },
                select: {
                    currentInterviewStep: true,
                    candidate: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    interviews: {
                        select: {
                            score: true
                        }
                    }
                },
                skip,
                take
            }),
            prisma.application.count({
                where: {
                    positionId: positionId
                }
            })
        ]);

        return [candidates, total];
    }
}
