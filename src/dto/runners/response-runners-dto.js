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