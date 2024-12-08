import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

const prisma = new PrismaClient();

export const prismaMock = mockDeep<PrismaClient>();

export type PrismaMock = DeepMockProxy<PrismaClient>;

export default prisma;
