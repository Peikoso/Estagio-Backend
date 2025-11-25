import { ValidationError } from "../../utils/errors.js";
import { validateTimestampFormat } from "../../utils/validations.js";

export class UpdateRunnerQueueDto {
    constructor(runnerQueue){
        this.runnerId = runnerQueue.runnerId?.trim();
        this.status = runnerQueue.status?.trim();
        this.scheduledFor = runnerQueue.scheduledFor;
        this.queuedAt = runnerQueue.queuedAt;
        this.startedAt = runnerQueue.startedAt;
        this.finishedAt = runnerQueue.finishedAt;
        this.attemptCount = Number(runnerQueue.attemptCount);
    }

    validate() {
        if(typeof this.runnerId !== 'string' || this.runnerId === '') {
            throw new ValidationError('Runner id is required and must be a non-empty string');
        }
        if(this.status !== 'PENDING' && this.status !== 'PROCESSING' && this.status !== 'COMPLETED' && this.status !== 'FAILED') {
            throw new ValidationError('Status must be one of the following values: PENDING, PROCESSING, COMPLETED, FAILED');
        }
        if(!validateTimestampFormat(this.scheduledFor)) {
            throw new ValidationError('Scheduled for must be in the format YYYY-MM-DDTHH:MM:SS.sssZ');
        }
        if(!validateTimestampFormat(this.queuedAt)) {
            throw new ValidationError('Queued at must be in the format YYYY-MM-DDTHH:MM:SS.sssZ');
        }
        if(this.startedAt && !validateTimestampFormat(this.startedAt)) {
            throw new ValidationError('Started at must be in the format YYYY-MM-DDTHH:MM:SS.sssZ');
        }
        if(this.finishedAt &&!validateTimestampFormat(this.finishedAt)) {
            throw new ValidationError('Finished at must be in the format YYYY-MM-DDTHH:MM:SS.sssZ');
        }
        if(isNaN(this.attemptCount) || !Number.isInteger(this.attemptCount)) {
            throw new ValidationError('Attempt count must be an integer number');
        }

        return this;
    }

};