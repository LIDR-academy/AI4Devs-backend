import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validators/candidateValidator';
import { EducationService } from './EducationService';
import { WorkExperienceService } from './WorkExperienceService';
import { ResumeService } from './ResumeService';
import { ApplicationService } from './ApplicationService';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { CreateCandidateDTO } from '../dtos/CreateCandidateDTO';
import { ValidationError, DatabaseError, NotFoundError } from '../errors/CustomErrors';
import { EducationRepository } from '../../infrastructure/repositories/EducationRepository';
import { WorkExperienceRepository } from '../../infrastructure/repositories/WorkExperienceRepository';
import { ResumeRepository } from '../../infrastructure/repositories/ResumeRepository';
import { ApplicationRepository } from '../../infrastructure/repositories/ApplicationRepository';
import { InterviewRepository } from '../../infrastructure/repositories/InterviewRepository';

export class CandidateService {
    private candidateRepository: ICandidateRepository;
    private applicationRepository: ApplicationRepository;
    private interviewRepository: InterviewRepository;

    constructor(candidateRepository: ICandidateRepository, applicationRepository: ApplicationRepository, interviewRepository: InterviewRepository) {
        this.candidateRepository = candidateRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
    }

    async addCandidate(candidateData: CreateCandidateDTO) {
        try {
            validateCandidateData(candidateData);
        } catch (error: any) {
            throw new ValidationError(error.message);
        }

        const candidate = new Candidate(candidateData);

        try {
            const savedCandidate = await this.candidateRepository.save(candidate);
            const candidateId = savedCandidate.id;

            if (typeof candidateId !== 'number') {
                throw new Error('Candidate ID is not valid');
            }

            // Use services to handle education, work experience, etc.
            const educationService = new EducationService(new EducationRepository());
            if (candidateData.educations) {
                candidate.education = await educationService.addEducations(candidateId, candidateData.educations);
            }

            const workExperienceService = new WorkExperienceService(new WorkExperienceRepository());
            if (candidateData.workExperiences) {
                candidate.workExperience = await workExperienceService.addWorkExperiences(candidateId, candidateData.workExperiences);
            }

            const resumeService = new ResumeService(new ResumeRepository());
            if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
                candidate.resumes = await resumeService.addResumes(candidateId, [candidateData.cv]);
            }

            const applicationService = new ApplicationService(new ApplicationRepository());
            if (candidateData.applications) {
                candidate.applications = await applicationService.addApplications(candidateId, candidateData.applications);
            }

            return savedCandidate;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundError('Candidate not found.');
            }
            throw new DatabaseError('Failed to save candidate.');
        }
    }

    async findCandidateById(candidateId: number): Promise<Candidate> {
        const candidate = await this.candidateRepository.findOne(candidateId);
        if (!candidate) {
            throw new NotFoundError(`Candidate with ID ${candidateId} not found`);
        }
        return candidate;
    }

    async getCandidatesByPositionService(positionId: number) {
        const applications = await this.applicationRepository.findByPositionId(positionId);
        const candidates = [];

        for (const application of applications) {
            if (application.candidateId === undefined || application.id === undefined) {
                console.warn(`Application with missing candidateId or id: ${JSON.stringify(application)}`);
                continue;
            }

            const candidate = await this.candidateRepository.findOne(application.candidateId);
            
            if (!candidate) {
                console.warn(`Candidate with ID ${application.candidateId} not found.`);
                continue;
            }

            const interviews = await this.interviewRepository.findByApplicationId(application.id);
            const averageScore = interviews.reduce((acc, interview) => acc + (interview.score || 0), 0) / interviews.length;

            candidates.push({
                fullName: `${candidate.firstName} ${candidate.lastName}`,
                currentInterviewStep: application.currentInterviewStep,
                averageScore: averageScore || 0,
            });
        }

        return candidates;
    }

    async updateCandidateStageService(candidateId: number, newStage: number) {
        const application = await this.applicationRepository.findByCandidateId(candidateId);
        if (!application) {
            throw new Error('Application not found for the candidate');
        }

        application.currentInterviewStep = newStage;
        await this.applicationRepository.update(application);
    }
}
