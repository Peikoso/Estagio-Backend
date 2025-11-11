import { pool } from '../config/database_conn.js';
import { Schedules } from '../models/schedules.js';

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