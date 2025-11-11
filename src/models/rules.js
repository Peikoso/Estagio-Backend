import { ValidationError } from '../utils/errors.js';
import { sqlValidantion } from '../utils/validations.js';

export class Rules {
    constructor(rule) {
        this.id = rule.id;
        this.name = rule.name;
        this.description = rule.description;
        this.sql = rule.sql;
        this.priority = rule.priority;
        this.roles = rule.roles;
        this.executionIntervalMs = rule.execution_interval_ms ?? rule.executionIntervalMs;
        this.maxErrorCount = rule.max_error_count ?? rule.maxErrorCount;
        this.timeoutMs = rule.timeout_ms ?? rule.timeoutMs;
        this.startTime = rule.start_time ?? rule.startTime;
        this.endTime = rule.end_time ?? rule.endTime;
        this.notificationEnabled = rule.notification_enabled ?? rule.notificationEnabled;
        this.isActive = rule.is_active ?? rule.isActive;
        this.silenceMode = rule.silence_mode ?? rule.silenceMode;
        this.postponeDate = rule.postpone_date ?? rule.postponeDate;
        this.userCreatorId = rule.user_creator_id ?? rule.userCreatorId;
        this.createdAt = rule.created_at ?? rule.createdAt;
        this.updatedAt = rule.updated_at ?? rule.updatedAt;
    }

    static fromArray(rulesArray) {
        return rulesArray.map((rule) => new Rules(rule));
    }

    validateBusinessLogic() {
        if (!sqlValidantion(this.sql)) {
            throw new ValidationError('SQL contains forbidden commands');
        }
        if (this.startTime >= this.endTime) {
            throw new ValidationError('Start time must be before end time');
        }
        if (this.postponeDate && this.postponeDate < new Date()) {
            throw new ValidationError('Postpone date must be in the future');
        }
        if (this.executionIntervalMs <= 0) {
            throw new ValidationError('Execution interval must be positive');
        }
        if (this.maxErrorCount < 0) {
            throw new ValidationError('Max error count cannot be negative');
        }
        if (this.timeoutMs <= 0) {
            throw new ValidationError('Timeout must be positive');
        }
        
        return this;
    }
}