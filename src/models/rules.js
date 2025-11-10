import { ValidationError } from '../utils/errors.js';
import { sqlValidantion } from '../utils/sql_validation.js';

export class Rules {
    constructor(rule) {
        this.id = rule.id;
        this.name = rule.name;
        this.description = rule.description;
        this.sql = rule.sql;
        this.priority = rule.priority;
        this.roles = rule.roles;
        this.execution_interval_ms = rule.execution_interval_ms;
        this.max_error_count = rule.max_error_count;
        this.timeout_ms = rule.timeout_ms;
        this.start_time = rule.start_time;
        this.end_time = rule.end_time;
        this.notification_enabled = rule.notification_enabled;
        this.is_active = rule.is_active;
        this.silence_mode = rule.silence_mode;
        this.postpone_date = rule.postpone_date;
        this.user_creator_id = rule.user_creator_id;
        this.created_at = rule.created_at;
        this.updated_at = rule.updated_at;
    }

    validateBusinessRules() {
        if(!(this.priority === 'LOW' || this.priority === 'MEDIUM' || this.priority === 'HIGH')) {
            throw new ValidationError('Priority must be LOW, MEDIUM, or HIGH');
        }
        if (this.execution_interval_ms <= 0) {
            throw new ValidationError('Execution interval must be positive');
        }
        if (this.max_error_count < 0) {
            throw new ValidationError('Max error count cannot be negative');
        }
        if (this.timeout_ms <= 0) {
            throw new ValidationError('Timeout must be positive');
        }
        if (this.start_time >= this.end_time) {
            throw new ValidationError('Start time must be before end time');
        }
        if (this.postpone_date && this.postpone_date < new Date()) {
            throw new ValidationError('Postpone date must be in the future');
        }
        if (!sqlValidantion(this.sql)) {
            throw new ValidationError('SQL contains forbidden commands');
        }

    }

}