export class StageNotificationService {
    async notifyStageChange(applicationId: number, oldStageId: number, newStageId: number): Promise<void> {
        console.log(`Application ${applicationId} moved from stage ${oldStageId} to ${newStageId}`);
    }
}
