import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

export class CandidateService {

    private candidateRepository: ICandidateRepository;

    constructor(candidateRepository: ICandidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    async addCandidate(candidateData: any): Promise<Candidate> {
        try {
            validateCandidateData(candidateData); // Validate candidate data
        } catch (error: any) {
            throw new Error(error);
        }

        const candidate = new Candidate(candidateData); // Create a new Candidate instance
        try {
            return await this.candidateRepository.save(candidate); // Save the candidate to the database
        } catch (error: any) {
            if (error.code === 'P2002') {
                // Unique constraint failed on the fields: (`email`)
                throw new Error('The email already exists');
            } else {
                throw error;
            }
        }
    }

    async findCandidateById(id: number): Promise<Candidate | null> {
        try {
            return await this.candidateRepository.findById(id);
        } catch (error) {
            console.error('Error finding candidate:', error);
            throw new Error('Error retrieving candidate');
        }
    }
}
