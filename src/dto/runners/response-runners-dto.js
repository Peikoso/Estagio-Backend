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
        this.runnerId = runnerLog.runnerId;
        this.runTimeMs = runnerLog.runTimeMs;
        this.result = runnerLog.result;
        this.error = runnerLog.error;
        this.executedAt = runnerLog.executedAt;
    }

    static fromArray(runnerLogsArray) {
        return runnerLogsArray.map(runnerLog => new ResponseRunnerLogsDto(runnerLog));
    }
};