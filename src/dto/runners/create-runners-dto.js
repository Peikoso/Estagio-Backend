import { ValidationError } from "../../utils/errors.js";
import { validateTimestampFormat } from "../../utils/validations.js";

export class CreateRunnerLogsDto {
    constructor(runnerLog){
        this.runner_id = runnerLog.runnerId?.trim();
        this.run_time_ms = Number(runnerLog.runTimeMs);
        this.result = runnerLog.result?.trim();
        this.error = runnerLog.error?.trim();
        this.executed_at = runnerLog.executedAt;
    }

    validate() {
        if (typeof this.runner_id !== 'string' || this.runner_id === '') {
            throw new ValidationError('Runner id is required and must be a non-empty string');
        }
        if (isNaN(this.run_time_ms) || !Number.isInteger(this.run_time_ms)) {
            throw new ValidationError('Run time must be a integer number');
        }
        if (typeof this.result !== 'string' || this.result === '') {
            throw new ValidationError('Result is required and must be a non-empty string');
        }
        if (typeof this.error !== 'string' || this.error === '') {
            throw new ValidationError('Error is required and must be a non-empty string');
        }
        if (!validateTimestampFormat(this.executed_at)) {
            throw new ValidationError('Executed at must be in the format YYYY-MM-DDTHH:MM:SS.sssZ');
        }

        return this;
    }
};