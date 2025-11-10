import { ValidationError } from '../../errors/validationError.js';

export class CreateIncidentsDto { 
    constructor(incident) {
        this.assignedUserId = incident.assignedUserId;
        this.ruleId = incident.ruleId;
        this.status = 'OPEN';
        this.priority = incident.priority;
    }

    validate() {
        if (!this.assignedUserId) {
            throw new ValidationError('assignedUserId is required');
        }
        if (!this.ruleId) {
            throw new ValidationError('ruleId is required');
        }
        if (!(this.status === 'OPEN' || this.status === 'ACK' || this.status === 'CLOSED')) {
            throw new ValidationError('Status must be OPEN, ACK, or CLOSED');
        }
        if (!(this.priority === 'LOW' || this.priority === 'MEDIUM' || this.priority === 'HIGH')) {
            throw new ValidationError('Priority must be LOW, MEDIUM, or HIGH');
        }

        return this;
    }
};