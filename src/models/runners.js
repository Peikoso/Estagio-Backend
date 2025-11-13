import { BusinessLogicError } from "../utils/errors.js";

export class Runners {
    constructor(runner){
        this.id = runner.id;
        this.rule_id = runner.rule_id ?? runner.ruleId;
        this.status = runner.status;
        this.last_run_at = runner.last_run_at ?? runner.lastRunAt;
        this.next_run_at = runner.next_run_at ?? runner.nextRunAt;
        this.created_at = runner.created_at ?? runner.createdAt;
        this.updated_at = runner.updated_at ?? runner.updatedAt;
    }

    static fromArray(runnersArray) {   
        return runnersArray.map(runner => new Runners(runner));
    }

    validateBusinessLogic() {
        if(this.last_run_at > this.next_run_at) {
            throw new BusinessLogicError('Last run time must be before next run time');
        }
        return this;
    }
    
};

export class RunnerLogs {
    constructor(runnerLog){
        this.id = runnerLog.id;
        this.runner_id = runnerLog.runner_id ?? runnerLog.runnerId;
        this.run_time_ms = runnerLog.run_time_ms ?? runnerLog.runTimeMs;
        this.result = runnerLog.result;
        this.error = runnerLog.error;
        this.executed_at = runnerLog.executed_at ?? runnerLog.executedAt;
    }

    validateBusinessLogic() {
        if(this.run_time_ms <= 0) {
            throw new BusinessLogicError('Run time must be positive');
        }

        return this;
    }

    static fromArray(runnerLogsArray) {
        return runnerLogsArray.map(runnerLog => new RunnerLogs(runnerLog));
    }
};