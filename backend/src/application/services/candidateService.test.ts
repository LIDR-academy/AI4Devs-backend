import { CandidateService } from './candidateService';
import { prismaMock } from '../singleton';
import { Prisma, PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

type MockApplication = Prisma.ApplicationGetPayload<{
    include: {
        candidate: true;
        interviews: true;
    }
}>;

// Mock de PrismaClient
const prismaClientMock = mockDeep<PrismaClient>();
const candidateService = new CandidateService(prismaClientMock);

beforeEach(() => {
    mockReset(prismaClientMock);
});

describe('getCandidatesByPositionId', () => {
    it('debería devolver la lista de candidatos con sus puntuaciones promedio', async () => {
        const positionId = 1;
        const mockData: MockApplication[] = [{
            id: 1,
            positionId: 1,
            candidateId: 1,
            applicationDate: new Date(),
            currentInterviewStep: 2,
            notes: null,
            candidate: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '1234567890',
                address: null
            },
            interviews: [
                {
                    id: 1,
                    applicationId: 1,
                    interviewStepId: 1,
                    employeeId: 1,
                    interviewDate: new Date(),
                    result: null,
                    score: 4,
                    notes: null
                },
                {
                    id: 2,
                    applicationId: 1,
                    interviewStepId: 2,
                    employeeId: 1,
                    interviewDate: new Date(),
                    result: null,
                    score: 5,
                    notes: null
                }
            ],
        }];

        prismaClientMock.application.findMany.mockResolvedValue(mockData);

        const result = await candidateService.getCandidatesByPositionId(positionId);

        expect(result).toEqual([
            {
                fullName: 'John Doe',
                currentInterviewStep: 2,
                averageScore: 4.5,
            },
        ]);
    });

    it('debería manejar candidatos sin entrevistas', async () => {
        const positionId = 1;
        const mockData: MockApplication[] = [{
            id: 1,
            positionId: 1,
            candidateId: 1,
            applicationDate: new Date(),
            currentInterviewStep: 1,
            notes: null,
            candidate: {
                id: 1,
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                phone: '1234567890',
                address: null
            },
            interviews: []
        }];

        prismaClientMock.application.findMany.mockResolvedValue(mockData);

        const result = await candidateService.getCandidatesByPositionId(positionId);

        expect(result).toEqual([
            {
                fullName: 'Jane Smith',
                currentInterviewStep: 1,
                averageScore: 'No hay información de entrevistas',
            },
        ]);
    });
});

describe('updateCandidateStage', () => {
    it('debería actualizar la etapa del candidato correctamente', async () => {
        // Configurar el mock para que devuelva una aplicación existente
        prismaClientMock.application.findUnique.mockResolvedValue({
            id: 1,
            candidateId: 1,
            positionId: 1,
            applicationDate: new Date(),
            currentInterviewStep: 1,
            notes: null
        });

        // Configurar el mock para la actualización
        prismaClientMock.application.update.mockResolvedValue({
            id: 1,
            candidateId: 1,
            positionId: 1,
            applicationDate: new Date(),
            currentInterviewStep: 2,
            notes: null
        });

        const result = await candidateService.updateCandidateStage(1, 2);

        expect(result.currentInterviewStep).toBe(2);
        expect(prismaClientMock.application.findUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        });
        expect(prismaClientMock.application.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { currentInterviewStep: 2 }
        });
    });

    it('debería lanzar un error si la aplicación no existe', async () => {
        // Configurar el mock para que devuelva null (aplicación no encontrada)
        prismaClientMock.application.findUnique.mockResolvedValue(null);

        await expect(
            candidateService.updateCandidateStage(1, 2)
        ).rejects.toThrow('Application not found');
    });
});
