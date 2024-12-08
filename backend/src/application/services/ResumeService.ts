import { Resume } from '../../domain/models/Resume';
import { ResumeRepository } from '../../infrastructure/repositories/ResumeRepository';

export class ResumeService {
    private resumeRepository: ResumeRepository;

    constructor(resumeRepository: ResumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    async addResumes(candidateId: number, resumes: any[]) {
        const resumeModels = [];
        for (const resume of resumes) {
            const resumeModel = new Resume(resume);
            resumeModel.candidateId = candidateId;
            const savedResume = await this.resumeRepository.save(resumeModel);
            resumeModels.push(savedResume);
        }
        return resumeModels;
    }
} 