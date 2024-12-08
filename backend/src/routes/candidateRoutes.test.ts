import request from 'supertest';
import app from '../index';

describe('GET /positions/:id/candidates', () => {
    it('debería devolver una lista de candidatos para un positionId válido', async () => {
        const response = await request(app).get('/positions/1/candidates');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('debería devolver un error para un positionId no válido', async () => {
        const response = await request(app).get('/positions/invalid/candidates');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid position ID format');
    });
});
