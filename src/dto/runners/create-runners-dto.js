import { ValidationError } from "../../utils/errors.js";
import { validateTimestampFormat } from "../../utils/validations.js";

export class CreateRunnersDto {
    constructor(runner){
        this.ruleId = runner.ruleId?.trim();
        this.status = runner.status?.trim();
        this.lastRunAt = runner.lastRunAt;
    }

    validate() {
        if(typeof this.ruleId !== 'string' || this.ruleId === '') {
            throw new ValidationError('Rule id is required and must be a non-empty string');
        }
        if(typeof this.status !== 'string' || this.status === '') {
            throw new ValidationError('Status is required and must be a non-empty string');
        }
        if(!validateTimestampFormat(this.lastRunAt)) {
            throw new ValidationError('Last run at must be in the format YYYY-MM-DDTHH:MM:SS.sssZ');
        }
        if(this.status !== 'IDLE' && this.status !== 'SCHEDULED' && this.status !== 'RUNNING' && this.status !== 'FAILED') {
            throw new ValidationError('Status must be either IDLE, SCHEDULED, RUNNING, or FAILED');
        }
        
        return this;
    }
    
};

export class CreateRunnerQueueDto {
    constructor(runnerQueue){
        this.runnerId = runnerQueue.runnerId?.trim();
        this.scheduledFor = runnerQueue.scheduledFor;
    }

    validate() {
        if(typeof this.runnerId !== 'string' || this.runnerId === '') {
            throw new ValidationError('Runner id is required and must be a non-empty string');
        }
        if(!validateTimestampFormat(this.scheduledFor)) {
            throw new ValidationError('Scheduled for must be in the format YYYY-MM-DDTHH:MM:SS.sssZ');
        }

        return this;
    }

};

export class CreateRunnerLogsDto {
    constructor(runnerLog){
        this.runnerId = runnerLog.runnerId?.trim();
        this.queueId = runnerLog.queueId?.trim();
        this.runTimeMs = Number(runnerLog.runTimeMs);
        this.executionStatus = runnerLog.executionStatus?.trim();
        this.rowsAffected = Number(runnerLog.rowsAffected);
        this.result = runnerLog.result?.trim();
        this.error = runnerLog.error?.trim();
        this.executedAt = runnerLog.executedAt;
    }

    validate() {
        if (typeof this.runnerId !== 'string' || this.runnerId === '') {
            throw new ValidationError('Runner id is required and must be a non-empty string');
        }
        if (typeof this.queueId !== 'string' || this.queueId === '') {
            throw new ValidationError('Queue id is required and must be a non-empty string');
        }
        if (isNaN(this.runTimeMs) || !Number.isInteger(this.runTimeMs)) {
            throw new ValidationError('Run time must be a integer number');
        }
        if (this.executionStatus !== 'SUCCESS' && this.executionStatus !== 'TIMEOUT' && this.executionStatus !== 'ERROR') {
            throw new ValidationError('Execution status must be either SUCCESS. TIMEOUT or ERROR');
        }
        if (isNaN(this.rowsAffected) || !Number.isInteger(this.rowsAffected)) {
            throw new ValidationError('Rows affected must be a integer number');
        }
        if (typeof this.result !== 'string' || this.result === '') {
            throw new ValidationError('Result is required and must be a non-empty string');
        }
        if (typeof this.error !== 'string' || this.error === '') {
            throw new ValidationError('Error is required and must be a non-empty string');
        }
        if (!validateTimestampFormat(this.executedAt)) {
            throw new ValidationError('Executed at must be in the format YYYY-MM-DDTHH:MM:SS.sssZ');
        }

        return this;
    }
};