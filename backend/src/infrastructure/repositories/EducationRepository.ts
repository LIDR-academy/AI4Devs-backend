import prisma from '../../prismaClient';
import { Education } from '../../domain/models/Education';

export class EducationRepository {
    async save(education: Education): Promise<Education> {
        const educationData = {
            institution: education.institution,
            title: education.title,
            startDate: education.startDate,
            endDate: education.endDate,
            candidateId: education.candidateId
        };

        if (education.id) {
            const updatedEducation = await prisma.education.update({
                where: { id: education.id },
                data: {
                    ...educationData,
                    endDate: education.endDate ?? undefined,
                    candidateId: education.candidateId as number
                }
            });
            return new Education(updatedEducation);
        } else {
            const createdEducation = await prisma.education.create({
                data: {
                    ...educationData,
                    endDate: education.endDate ?? undefined,
                    candidateId: education.candidateId as number
                }
            });
            return new Education(createdEducation);
        }
    }
} 