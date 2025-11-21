import { pool } from "../config/database-conn.js";
import { Notifications } from "../models/notifications.js";

export const NotificationsRepository = {
    findByUserId: async (id) => {
        const selectQuery = 'SELECT * FROM notifications WHERE user_id = $1';
        
        const result = await pool.query(selectQuery, [id]);

        return Notifications.fromArray(result.rows);
    },

    create : async (notification) => {
        const insertQuery = 
        `
        INSERT INTO notifications
        (user_id, channel_id, incident_id, title, message, status, sent_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `;
        const values = [
            notification.userId,
            notification.channelId,
            notification.incidentId,
            notification.title,
            notification.message,
            notification.sentAt,
            notification.status,
        ];

        const result = await pool.query(insertQuery, values);

        return new Notifications(result.rows[0]);
    },
};