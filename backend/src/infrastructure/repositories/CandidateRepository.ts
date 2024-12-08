import prisma from '../../prismaClient';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { Application } from '../../domain/models/Application';

/**
 * CandidateRepository handles all database operations related to candidates.
 */
export class CandidateRepository {
    /**
     * Saves a candidate to the database. If the candidate has an ID, it updates the existing record.
     * Otherwise, it creates a new record.
     * 
     * @param candidate - The candidate object to be saved.
     * @returns The saved candidate object.
     */
    async save(candidate: Candidate): Promise<Candidate> {
        const candidateData: any = {
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone,
            address: candidate.address,
            educations: {
                create: candidate.education.map((edu: Education) => ({
                    institution: edu.institution,
                    title: edu.title,
                    startDate: edu.startDate,
                    endDate: edu.endDate
                }))
            },
            workExperiences: {
                create: candidate.workExperience.map((exp: WorkExperience) => ({
                    company: exp.company,
                    position: exp.position,
                    description: exp.description,
                    startDate: exp.startDate,
                    endDate: exp.endDate
                }))
            },
            resumes: {
                create: candidate.resumes.map((resume: Resume) => ({
                    filePath: resume.filePath,
                    fileType: resume.fileType
                }))
            },
            applications: {
                create: candidate.applications.map((app: Application) => ({
                    positionId: app.positionId,
                    candidateId: app.candidateId,
                    applicationDate: app.applicationDate,
                    currentInterviewStep: app.currentInterviewStep,
                    notes: app.notes,
                }))
            }
        };

        if (candidate.id) {
            const updatedCandidate = await prisma.candidate.update({
                where: { id: candidate.id },
                data: candidateData,
                include: {
                    educations: true,
                    workExperiences: true,
                    resumes: true,
                    applications: true
                }
            });
            return new Candidate(updatedCandidate);
        } else {
            const createdCandidate = await prisma.candidate.create({
                data: candidateData,
                include: {
                    educations: true,
                    workExperiences: true,
                    resumes: true,
                    applications: true
                }
            });
            return new Candidate(createdCandidate);
        }
    }

    /**
     * Finds a candidate by ID, including related records.
     * 
     * @param id - The ID of the candidate to find.
     * @returns The candidate object, or null if not found.
     */
    async findOne(id: number): Promise<Candidate | null> {
        const data = await prisma.candidate.findUnique({
            where: { id: id },
            include: {
                educations: true,
                workExperiences: true,
                resumes: true,
                applications: {
                    include: {
                        position: {
                            select: {
                                id: true,
                                title: true
                            }
                        },
                        interviews: {
                            select: {
                                interviewDate: true,
                                interviewStep: {
                                    select: {
                                        name: true
                                    }
                                },
                                notes: true,
                                score: true
                            }
                        }
                    }
                }
            }
        });
        return data ? new Candidate(data) : null;
    }
}