import prisma from '../../prismaClient';
import { WorkExperience } from '../../domain/models/WorkExperience';

export class WorkExperienceRepository {
    async save(workExperience: WorkExperience): Promise<WorkExperience> {
        const workExperienceData = {
            company: workExperience.company,
            position: workExperience.position,
            description: workExperience.description ?? undefined,
            startDate: workExperience.startDate,
            endDate: workExperience.endDate ?? undefined,
            candidateId: workExperience.candidateId
        };

        if (workExperience.id) {
            const updatedWorkExperience = await prisma.workExperience.update({
                where: { id: workExperience.id },
                data: {
                    ...workExperienceData,
                    candidateId: workExperience.candidateId as number
                }
            });
            return new WorkExperience(updatedWorkExperience);
        } else {
            const createdWorkExperience = await prisma.workExperience.create({
                data: {
                    ...workExperienceData,
                    candidateId: workExperience.candidateId as number
                }
            });
            return new WorkExperience(createdWorkExperience);
        }
    }
} 