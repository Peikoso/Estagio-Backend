export class Schedules {
    constructor(schedule) {
        this.id = schedule.id;
        this.userId = schedule.user_id ?? schedule.userId;
        this.channel = schedule.channel;
        this.startTime = schedule.start_time ?? schedule.startTime;
        this.endTime = schedule.end_time ?? schedule.endTime;
        this.createdAt = schedule.created_at ?? schedule.createdAt;
        this.updatedAt = schedule.updated_at ?? schedule.updatedAt;
    }

    static fromArray(schedules) {
        return schedules.map((schedule) => new Schedules(schedule));
    }

    validateBusinessLogic() {
        if (this.startTime >= this.endTime) {
            throw new ValidationError('Start time must be before end time');
        }

        return this;
    }
}

export class ScheduleLogs {
    constructor(scheduleLog) {
        this.id = scheduleLog.id;
        this.scheduleId = scheduleLog.schedule_id ?? scheduleLog.scheduleId;
        this.userId = scheduleLog.user_id ?? scheduleLog.userId;
        this.actionType = scheduleLog.action_type ?? scheduleLog.actionType;
        this.description = scheduleLog.description;
        this.oldValue = scheduleLog.old_value ?? scheduleLog.oldValue;
        this.newValue = scheduleLog.new_value ?? scheduleLog.newValue;
        this.createdAt = scheduleLog.created_at ?? scheduleLog.createdAt;
    }

    static fromArray(logs) {
        return logs.map((log) => new ScheduleLogs(log));
    }
}