export interface CandidatePositionResponse {
    name: string;
    currentInterviewStep: number;
    averageScore: number | null;
}

export interface CandidatePositionPaginatedResponse {
    data: CandidatePositionResponse[];
    total: number;
    page: number;
    pageSize: number;
}
