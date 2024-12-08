import { Education } from '../../domain/models/Education';
import { EducationRepository } from '../../infrastructure/repositories/EducationRepository';

export class EducationService {
    private educationRepository: EducationRepository;

    constructor(educationRepository: EducationRepository) {
        this.educationRepository = educationRepository;
    }

    async addEducations(candidateId: number, educations: any[]) {
        const educationModels = [];
        for (const education of educations) {
            const educationModel = new Education(education);
            educationModel.candidateId = candidateId;
            const savedEducation = await this.educationRepository.save(educationModel);
            educationModels.push(savedEducation);
        }
        return educationModels;
    }
} 