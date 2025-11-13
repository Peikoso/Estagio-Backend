export class ResponseRunnersDto {
    constructor(runner){
        this.id = runner.id;
        this.rule_id = runner.ruleId;
        this.status = runner.status;
        this.last_run_at = runner.lastRunAt;
        this.next_run_at = runner.nextRunAt;
    }

    static fromArray(runnersArray) {   
        return runnersArray.map(runner => new ResponseRunnersDto(runner));
    }
}

export class ResponseRunnerLogsDto {
    constructor(runnerLog){
        this.id = runnerLog.id;
        this.runner_id = runnerLog.runnerId;
        this.run_time_ms = runnerLog.runTimeMs;
        this.result = runnerLog.result;
        this.error = runnerLog.error;
        this.executed_at = runnerLog.executedAt;
    }

    static fromArray(runnerLogsArray) {
        return runnerLogsArray.map(runnerLog => new ResponseRunnerLogsDto(runnerLog));
    }
};