import { WorkExperience } from '../../domain/models/WorkExperience';
import { WorkExperienceRepository } from '../../infrastructure/repositories/WorkExperienceRepository';

export class WorkExperienceService {
    private workExperienceRepository: WorkExperienceRepository;

    constructor(workExperienceRepository: WorkExperienceRepository) {
        this.workExperienceRepository = workExperienceRepository;
    }

    async addWorkExperiences(candidateId: number, workExperiences: any[]) {
        const workExperienceModels = [];
        for (const experience of workExperiences) {
            const experienceModel = new WorkExperience(experience);
            experienceModel.candidateId = candidateId;
            const savedExperience = await this.workExperienceRepository.save(experienceModel);
            workExperienceModels.push(savedExperience);
        }
        return workExperienceModels;
    }
} 