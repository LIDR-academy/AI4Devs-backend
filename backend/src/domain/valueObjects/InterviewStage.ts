export class InterviewStage {
    private constructor(private readonly value: number) {
        this.validateStage(value);
    }

    private validateStage(value: number): void {
        if (value < 1) {
            throw new Error('Interview stage must be a positive number');
        }
    }

    static create(value: number): InterviewStage {
        return new InterviewStage(value);
    }

    static fromExisting(value: number): InterviewStage {
        return new InterviewStage(value);
    }

    getValue(): number {
        return this.value;
    }

    canTransitionTo(nextStage: InterviewStage): boolean {
        // Define valid transitions
        const validTransitions = new Map<number, number[]>([
            [1, [2]], // From stage 1 can only go to 2
            [2, [3, 4]], // From stage 2 can go to 3 or 4
            [3, [4, 5]], // From stage 3 can go to 4 or 5
            [4, [5]], // From stage 4 can only go to 5
            [5, []] // Stage 5 is final
        ]);

        const allowedNextStages = validTransitions.get(this.value) || [];
        return allowedNextStages.includes(nextStage.getValue());
    }

    equals(other: InterviewStage): boolean {
        return this.value === other.getValue();
    }
}