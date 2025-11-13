import { pool } from '../config/database-conn.js';
import { Schedules, ScheduleLogs } from '../models/schedules.js';

export const SchedulesRepository = {
    findUpcomingSchedules: async (date) => {
        const selectQuery = 
        `
        SELECT * FROM schedules
        WHERE DATE(start_time) >= $1 
        ORDER BY start_time DESC
        `;

        const result = await pool.query(selectQuery, [date]);
        
        return Schedules.fromArray(result.rows);
    },

    findById: async (id) => {
        const result = await pool.query(`SELECT * FROM schedules WHERE id = $1`, [id]);

        return new Schedules(result.rows[0]);
    },

    create: async (schedule) => {
        const insertQuery = 
        `
        INSERT INTO schedules
        (user_id, channel, start_time, end_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;

        const values = [
            schedule.userId,
            schedule.channel,
            schedule.startTime,
            schedule.endTime
        ];

        const result = await pool.query(insertQuery, values);

        return new Schedules(result.rows[0]);
    }
};

export const SchedulesLogsRepository = {
    findScheduleLogsByScheduleId: async (scheduleId) => {
        const selectQuery = 
        `
        SELECT * FROM schedules_logs
        WHERE schedule_id = $1
        ORDER BY log_time DESC
        `;
        const result = await pool.query(selectQuery, [scheduleId]);
        
        return ScheduleLogs.fromArray(result.rows);
    },

    create: async (scheduleLog) => {
        const insertQuery = 
        `
        INSERT INTO schedules_logs
        (schedule_id, user_id, action_type, description, old_value, new_value)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `;
        const values = [
            scheduleLog.scheduleId,
            scheduleLog.userId,
            scheduleLog.actionType,
            scheduleLog.description,
            scheduleLog.oldValue,
            scheduleLog.newValue
        ];

        const result = await pool.query(insertQuery, values);

        return new ScheduleLogs(result.rows[0]);
    }
};