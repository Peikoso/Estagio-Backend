import { pool } from '../config/database_conn.js'
import { Incidents } from '../models/incidents.js'

export const IncidentsRepository = {
    findAll: async () => {
        const result = await pool.query(
            `
            SELECT * FROM incidents
            ORDER BY created_at DESC;
            `
        );

        return Incidents.fromArray(result.rows);
    },

    findById: async(id) => {
        const selectIdQuery =
        `
        SELECT * FROM incidents
        WHERE id = $1
        `;

        const result = await pool.query(selectIdQuery, [id]);

        return new Incidents(result.rows[0]);
    },

    create: async(incidentData) => {
        const insertIncidentQuery =
        `
        INSERT INTO incidents
        (assigned_user_id, rule_id, status, priority)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `

        const values = [
            incidentData.assignedUserId,
            incidentData.ruleId,
            incidentData.status,
            incidentData.priority
        ]

        const result = await pool.query(insertIncidentQuery, values);

        return new Incidents(result.rows[0]);
    }
};