import { Candidate } from '../models/Candidate';

export interface ICandidateRepository {
    save(candidate: Candidate): Promise<Candidate>;
    findOne(id: number): Promise<Candidate | null>;
} 