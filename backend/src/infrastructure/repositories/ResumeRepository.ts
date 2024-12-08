import prisma from '../../prismaClient';
import { Resume } from '../../domain/models/Resume';

export class ResumeRepository {
    async save(resume: Resume): Promise<Resume> {
        if (resume.id) {
            return await prisma.resume.update({
                where: { id: resume.id },
                data: {
                    candidateId: resume.candidateId,
                    filePath: resume.filePath,
                    fileType: resume.fileType,
                    uploadDate: resume.uploadDate
                }
            });
        } else {
            const createdResume = await prisma.resume.create({
                data: {
                    candidateId: resume.candidateId,
                    filePath: resume.filePath,
                    fileType: resume.fileType,
                    uploadDate: resume.uploadDate
                }
            });
            return new Resume(createdResume);
        }
    }
} 