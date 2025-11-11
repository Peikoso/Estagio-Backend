export class ResponseSchedulesDto {
    constructor(schedule) {
        this.id = schedule.id;
        this.userId = schedule.userId;
        this.channel = schedule.channel;
        this.startTime = schedule.startTime;
        this.endTime = schedule.endTime;
    }

    static fromArray(schedules) {
        return schedules.map((schedule) => new ResponseSchedulesDto(schedule));
    }
}

export class ResponseScheduleLogs {
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