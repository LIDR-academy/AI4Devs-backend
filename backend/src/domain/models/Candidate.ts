import { PrismaClient } from '@prisma/client';
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

        if (this.firstName !== undefined) candidateData.firstName = this.firstName;
        if (this.lastName !== undefined) candidateData.lastName = this.lastName;
        if (this.email !== undefined) candidateData.email = this.email;
        if (this.phone !== undefined) candidateData.phone = this.phone;
        if (this.address !== undefined) candidateData.address = this.address;

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

        if (this.resumes.length > 0) {
            candidateData.resumes = {
                create: this.resumes.map(resume => ({
                    filePath: resume.filePath,
                    fileType: resume.fileType
                }))
            };
        }

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
            return await prisma.candidate.update({
                where: { id: this.id },
                data: candidateData,
            });
        } else {
            return await prisma.candidate.create({
                data: candidateData,
            });
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

    static async findApplicationsByPositionId(positionId: number): Promise<Application[]> {
        const data = await prisma.application.findMany({
            where: { positionId },
            include: {
                candidate: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                interviews: {
                    select: {
                        score: true,
                    },
                },
            },
        });
        return data.map(app => new Application(app));
    }
}
