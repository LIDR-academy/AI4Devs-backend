export interface CandidateDTO {
    full_name: string;
    current_interview_step: string;
    average_score: number | null;
}

export interface InterviewStageDTO {
    id: number;
    name: string;
} 