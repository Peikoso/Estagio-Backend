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

    static fromArray(runnerLogsArray) {
        return runnerLogsArray.map(runnerLog => new RunnerLogs(runnerLog));
    }
};