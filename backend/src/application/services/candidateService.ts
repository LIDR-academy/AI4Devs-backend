import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import prisma from '../../prismaClient';
import { Application } from '../../domain/models/Application';
import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { StageValidationService } from './StageValidationService';
import { StageNotificationService } from './StageNotificationService';
import { InterviewStage } from '../../domain/valueObjects/InterviewStage';

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

export const getCandidatesByPositionService = async (positionId: number) => {
    const applications = await prisma.application.findMany({
        where: { positionId },
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
        }
    });

    const candidates = applications.map(app => {
        const candidateName = `${app.candidate?.firstName ?? ''} ${app.candidate?.lastName ?? ''}`;
        const interviewScores = app.interviews?.map(interview => interview.score ?? 0) ?? [];

        const averageScore = interviewScores.length > 0
            ? interviewScores.reduce((a, b) => a + b, 0) / interviewScores.length
            : null;

        return {
            candidateName,
            currentInterviewStep: app.currentInterviewStep,
            averageScore
        };
    });

    return candidates;
};

export const updateCandidateStageService = async (
    candidateId: number, 
    newStageId: number,
    applicationRepository: IApplicationRepository,
    stageValidator: StageValidationService,
    notificationService: StageNotificationService
): Promise<Application> => {
    const application = await applicationRepository.findByCandidate(candidateId);
    
    if (!application) {
        throw new Error('Application not found for this candidate');
    }

    const newStage = InterviewStage.create(newStageId);
    await stageValidator.validateStageTransition(application.currentInterviewStep, newStage.getValue());
    
    const updatedApplication = await applicationRepository.updateStage(application.id!, newStage.getValue());
    
    await notificationService.notifyStageChange(
        application.id!,
        application.currentInterviewStep,
        newStage.getValue()
    );

    return updatedApplication;
};
