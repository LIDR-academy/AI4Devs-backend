import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Interview {
    id: number;
    applicationId: number;
    score: number;
    date: Date;

    constructor(data: any) {
        this.id = data.id;
        this.applicationId = data.applicationId;
        this.score = data.score;
        this.date = new Date(data.date);
    }
}