import { ValidationError } from '../../utils/errors.js';
import { sqlValidantion } from '../../utils/sql_validation.js';

export class CreateRulesDto {
    constructor(rule) {
        this.name = rule.name;
        this.description = rule.description;
        this.sql = rule.sql;
        this.priority = rule.priority;
        this.roles = Array.isArray(rule.roles) ? [...new set(rule.roles)] : [];
        this.executionIntervalMs = Number(rule.executionIntervalMs);
        this.maxErrorCount = Number(rule.maxErrorCount);
        this.timeoutMs = Number(rule.timeoutMs);
        this.startTime = rule.startTime;
        this.endTime = rule.endTime;
        this.notificationEnabled = rule.notificationEnabled;
        this.isActive = rule.isActive;
        this.silenceMode = rule.silenceMode;
        this.postponeDate = rule.postponeDate;
        this.userCreatorId = rule.userCreatorId;
    }

    validateTimeFormat(time) {
        const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        return regex.test(time);
    }


    validate() {
        if(typeof this.name !== 'string' || this.name.trim() === '') {
            throw new ValidationError('Name is required and must be a non-empty string');
        }
        if(typeof this.description !== 'string' || this.description.trim() === '') {
            throw new ValidationError('Description is required and must be a non-empty string');
        }
        if(typeof this.sql !== 'string' || this.sql.trim() === '') {
            throw new ValidationError('SQL is required and must be a non-empty string');
        }
        if(typeof this.priority !== 'string' || this.priority.trim() === '') {
            throw new ValidationError('Priority must be LOW, MEDIUM, or HIGH');
        }
        if(!Array.isArray(this.roles) || this.roles.length === 0 || !this.roles.every(role => typeof role === 'string')) {
            throw new ValidationError('Roles must be a non-empty array of strings');
        }
        if(isNaN(this.executionIntervalMs)) {
            throw new ValidationError('Execution interval must be a number');
        }
        if(isNaN(this.maxErrorCount)) {
            throw new ValidationError('Max error count must be a number');
        }
        if(isNaN(this.timeoutMs)) {
            throw new ValidationError('Timeout must be a number');
        }
        if(!this.validateTimeFormat(this.startTime)) {
            throw new ValidationError('Start time must be in the format HH:MM:SS');
        }
        if(!this.validateTimeFormat(this.endTime)) {
            throw new ValidationError('End time must be in the format HH:MM:SS');
        }
        if(typeof this.notificationEnabled !== 'boolean') {
            throw new ValidationError('Notification enabled must be a boolean');
        }
        if(typeof this.isActive !== 'boolean') {
            throw new ValidationError('Is active must be a boolean');
        }
        if(this.postponeDate && isNaN(Date.parse(this.postponeDate))) {
            throw new ValidationError('Postpone date must be a Date');
        }
        if(typeof this.userCreatorId !== 'string' || this.userCreatorId.trim() === '') {
            throw new ValidationError('User creator ID must be a non-empty string');
        }
        if(this.userCreatorId.length !== 36) {
            throw new ValidationError('User creator ID must be a valid UUID');
        }
        if(this.name.length > 100) {
            throw new ValidationError('Name must be between 1 and 100 characters');
        }
        if(this.description.length > 255) {
            throw new ValidationError('Description must be between 1 and 255 characters');
        }
        if(!(this.priority === 'LOW' || this.priority === 'MEDIUM' || this.priority === 'HIGH')) {
            throw new ValidationError('Priority must be LOW, MEDIUM, or HIGH');
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
        if (this.startTime >= this.endTime) {
            throw new ValidationError('Start time must be before end time');
        }
        if (this.postponeDate && this.postponeDate < new Date()) {
            throw new ValidationError('Postpone date must be in the future');
        }
        if (!sqlValidantion(this.sql)) {
            throw new ValidationError('SQL contains forbidden commands');
        }
        
        return this;
    }

}