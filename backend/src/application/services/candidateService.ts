import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { PrismaClient } from '@prisma/client';
import prisma from '../singleton';

export const addCandidate = async (candidateData: any) => {
    try {
        validateCandidateData(candidateData); // Validar los datos del candidato
    } catch (error: any) {
        throw new Error(error);
    }

    const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

        // Guardar la educación del candidato
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                const educationModel = new Education(education);
                educationModel.candidateId = candidateId;
                await educationModel.save();
                candidate.education.push(educationModel);
            }
        }

        // Guardar la experiencia laboral del candidato
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                const experienceModel = new WorkExperience(experience);
                experienceModel.candidateId = candidateId;
                await experienceModel.save();
                candidate.workExperience.push(experienceModel);
            }
        }

        // Guardar los archivos de CV
        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            const resumeModel = new Resume(candidateData.cv);
            resumeModel.candidateId = candidateId;
            await resumeModel.save();
            candidate.resumes.push(resumeModel);
        }
        return savedCandidate;
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        } else {
            throw error;
        }
    }
};

export const findCandidateById = async (id: number): Promise<Candidate | null> => {
    try {
        const candidate = await Candidate.findOne(id); // Cambio aquí: pasar directamente el id
        return candidate;
    } catch (error) {
        console.error('Error al buscar el candidato:', error);
        throw new Error('Error al recuperar el candidato');
    }
};

export class CandidateService {
    constructor(private prismaClient: PrismaClient) {}

    async getCandidatesByPositionId(positionId: number) {
        const applications = await this.prismaClient.application.findMany({
            where: { positionId },
            include: {
                candidate: true,
                interviews: true,
            },
        });

        return applications.map(app => {
            const fullName = `${app.candidate.firstName} ${app.candidate.lastName}`;
            const averageScore = this.calculateAverageScore(app.interviews);

            return {
                fullName,
                currentInterviewStep: app.currentInterviewStep,
                averageScore,
            };
        });
    }

    private calculateAverageScore(interviews: { score: number | null }[]) {
        if (interviews.length === 0) {
            return 'No hay información de entrevistas';
        }
        const totalScore = interviews.reduce((sum, interview) => sum + (interview.score || 0), 0);
        return totalScore / interviews.length;
    }

    async updateCandidateStage(applicationId: number, newStage: number) {
        const application = await this.prismaClient.application.findUnique({
            where: { id: applicationId }
        });

        if (!application) {
            throw new Error('Application not found');
        }

        const updatedApplication = await this.prismaClient.application.update({
            where: { id: applicationId },
            data: { currentInterviewStep: newStage }
        });

        return updatedApplication;
    }
}
