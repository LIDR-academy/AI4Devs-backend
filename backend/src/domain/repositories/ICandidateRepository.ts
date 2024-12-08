import { Candidate } from '../models/Candidate';

export interface ICandidateRepository {
    save(candidate: Candidate): Promise<any>;
    findById(id: number): Promise<Candidate | null>;
}