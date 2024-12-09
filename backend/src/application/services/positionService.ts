import { Position } from '../../domain/models/Position';

export const getCandidatesByPositionId = async (positionId: number) => {
    try {
        const position = new Position({ id: positionId });
        const positionData = await position.getCandidatesWithInterviewInfo();
        
        if (!positionData) {
            throw new Error('La posición no existe');
        }

        const candidates = positionData.applications.map(application => ({
            fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
            currentInterviewStep: application.interviewStep.name,
            averageScore: calculateAverageScore(application.interviews)
        }));

        return {
            positionId,
            candidates
        };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error al obtener los candidatos de la posición');
    }
};

const calculateAverageScore = (interviews: any[]): number | null => {
    const scores = interviews
        .filter(interview => interview.score !== null)
        .map(interview => interview.score);
    
    if (scores.length === 0) return null;
    
    const average = scores.reduce((acc, score) => acc + score, 0) / scores.length;
    return Number(average.toFixed(2)); // Redondear a 2 decimales
};
