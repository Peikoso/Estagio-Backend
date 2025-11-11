import { ValidationError } from '../../utils/errors.js';
import { validateTimestampFormat } from '../../utils/validations.js';

export class CreateSchedulesDto {
    constructor(schedule) {
        this.userId = schedule.userId;
        this.channel = schedule.channel;
        this.startTime = schedule.startTime;
        this.endTime = schedule.endTime;
    }

    validate() {
        if(!this.userId || this.userId.trim() === '') {
            throw new ValidationError('userId is required');
        }

        if(!this.channel || this.channel.trim() === '') {
            throw new ValidationError('channel is required');
        }
        if(this.channel.length > 30) {
            throw new ValidationError('channel must not exceed 30 characters');
        }
        if(!validateTimestampFormat(this.startTime)) {
            throw new ValidationError('Start time must be in the format YYYY-MM-DDTHH:MM:SS.sssZ');
        }
        if(!validateTimestampFormat(this.endTime)) {
            throw new ValidationError('End time must be in the format YYYY-MM-DDTHH:MM:SS.sssZ');
        }

        return this;
    }
}
