import { BusinessLogicError } from "../utils/errors.js";

export class Runners {
    constructor(runner){
        this.id = runner.id;
        this.ruleId = runner.rule_id ?? runner.ruleId;
        this.status = runner.status;
        this.lastRunAt = runner.last_run_at ?? runner.lastRunAt;
        this.nextRunAt = runner.next_run_at ?? runner.nextRunAt;
        this.createdAt = runner.created_at ?? runner.createdAt;
        this.updatedAt = runner.updated_at ?? runner.updatedAt;
    }

    static fromArray(runnersArray) {   
        return runnersArray.map(runner => new Runners(runner));
    }

    validateBusinessLogic() {
        if(this.lastRunAt > this.nextRunAt) {
            throw new BusinessLogicError('Last run time must be before next run time');
        }

        return this;
    }
    
};

export class RunnerQueue{
    constructor(runnerQueue){
        this.id = runnerQueue.id;
        this.runnerId = runnerQueue.runner_id ?? runnerQueue.runnerId;
        this.scheduledFor = runnerQueue.scheduled_for ?? runnerQueue.scheduledFor;
        this.queuedAt = runnerQueue.queued_at ?? runnerQueue.queuedAt;
        this.startedAt = runnerQueue.started_at ?? runnerQueue.startedAt;
        this.finishedAt = runnerQueue.finished_at ?? runnerQueue.finishedAt;
        this.attemptCount = runnerQueue.attempt_count ?? runnerQueue.attemptCount;

    }

    validateBusinessLogic() {
        if(this.attemptCount < 0) {
            throw new BusinessLogicError('Attempts cannot be negative');
        }

        return this;
    }

    static fromArray(runnerQueueArray) {
        return runnerQueueArray.map(runnerQueue => new RunnerQueue(runnerQueue));
    }
};

export class RunnerLogs {
    constructor(runnerLog){
        this.id = runnerLog.id;
        this.runnerId = runnerLog.runner_id ?? runnerLog.runnerId;
        this.queueId = runnerLog.queue_id ?? runnerLog.queueId;
        this.runTimeMs = runnerLog.run_time_ms ?? runnerLog.runTimeMs;
        this.executionStatus = runnerLog.execution_status ?? runnerLog.executionStatus;
        this.rowsAffected = runnerLog.rows_affected ?? runnerLog.rowsAffected;
        this.result = runnerLog.result;
        this.error = runnerLog.error;
        this.executedAt = runnerLog.executed_at ?? runnerLog.executedAt;
    }

    validateBusinessLogic() {
        if(this.runTimeMs <= 0) {
            throw new BusinessLogicError('Run time must be positive');
        }
        if(this.rowsAffected < 0) {
            throw new BusinessLogicError('Rows affected cannot be negative');
        }

        return this;
    }

    static fromArray(runnerLogsArray) {
        return runnerLogsArray.map(runnerLog => new RunnerLogs(runnerLog));
    }
};