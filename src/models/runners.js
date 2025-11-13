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

    fromArray(runnersArray) {   
        return runnersArray.map(runner => new Runners(runner));
    }
}