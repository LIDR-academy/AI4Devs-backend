import { ApplicationError } from './ApplicationError';

export class ApplicationNotFoundError extends ApplicationError {
    constructor(candidateId: number) {
        super(`Application not found for candidate ${candidateId}`);
        this.name = 'ApplicationNotFoundError';
    }
}
