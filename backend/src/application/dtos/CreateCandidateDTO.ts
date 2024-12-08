export interface CreateCandidateDTO {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    educations?: {
        institution: string;
        title: string;
        startDate: string;
        endDate?: string;
    }[];
    workExperiences?: {
        company: string;
        position: string;
        description?: string;
        startDate: string;
        endDate?: string;
    }[];
    cv?: {
        filePath: string;
        fileType: string;
    };
    applications?: {
        positionId: number;
        applicationDate: string;
        currentInterviewStep: number;
        notes?: string;
    }[];
} 