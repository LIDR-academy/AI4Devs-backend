import prisma from '../../prismaClient';
import { Interview } from '../../domain/models/Interview';

export class InterviewRepository {
    async findByApplicationId(applicationId: number): Promise<Interview[]> {
        const interviews = await prisma.interview.findMany({
            where: { applicationId },
        });
        return interviews.map(interview => new Interview(interview));
    }
}