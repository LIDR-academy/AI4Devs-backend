import { Application } from '../../domain/models/Application';
import { ApplicationRepository } from '../../infrastructure/repositories/ApplicationRepository';

export class ApplicationService {
    private applicationRepository: ApplicationRepository;

    constructor(applicationRepository: ApplicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    async addApplications(candidateId: number, applications: any[]) {
        const applicationModels = [];
        for (const application of applications) {
            const applicationModel = new Application(application);
            applicationModel.candidateId = candidateId;
            const savedApplication = await this.applicationRepository.save(applicationModel);
            applicationModels.push(savedApplication);
        }
        return applicationModels;
    }
} 