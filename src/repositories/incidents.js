import { pool } from '../config/database_conn.js'
import { Incidents, IncidentsLogs } from '../models/incidents.js'

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

        if(!result.rows[0]){
            return null;
        }

        return new Incidents(result.rows[0]);
    },

    create: async(incident) => {
        const insertIncidentQuery =
        `
        INSERT INTO incidents
        (assigned_user_id, rule_id, status, priority)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
        `

        const values = [
            incident.assignedUserId,
            incident.ruleId,
            incident.status,
            incident.priority
        ]

        const incidentDB = await pool.query(insertIncidentQuery, values);

        const insertRoleIncidentQuery = ` INSERT INTO incidents_roles (incident_id, role_id) VALUES ($1, $2); `;

        for (const roleId of incident.roles) {
            await pool.query(insertRoleIncidentQuery, [incidentDB.rows[0].id, roleId]);
        }

        const incidentWithRolesQuery =
        `
        SELECT i.*, array_agg(ir.role_id) AS roles
        FROM incidents i
        LEFT JOIN incidents_roles ir ON i.id = ir.incident_id
        WHERE i.id = $1
        GROUP BY i.id;
        `;

        const result = await pool.query(incidentWithRolesQuery, [incidentDB.rows[0].id]);

        return new Incidents(result.rows[0]);
    },

    update: async(incident) => {
        const updateIncidentQuery =
        `
        UPDATE incidents
        SET assigned_user_id = $1,
            rule_id = $2,
            status = $3,
            priority = $4,
            ack_at = $5,
            closed_at = $6,
            updated_at = NOW()
        WHERE id = $7
        RETURNING *;
        `;
        const values = [
            incident.assignedUserId,
            incident.ruleId,
            incident.status,
            incident.priority,
            incident.ackAt,
            incident.closedAt,
            incident.id
        ];
        const result = await pool.query(updateIncidentQuery, values);

        return new Incidents(result.rows[0]);
    }
};

export const IncidentsLogsRepository = {
    findByIncidentId: async (incidentId) => {
        const selectByIncidentIdQuery =
        `
        SELECT * FROM incidents_logs
        WHERE incident_id = $1
        ORDER BY created_at DESC;
        `;

        const result = await pool.query(selectByIncidentIdQuery, [incidentId]);

        return IncidentsLogs.fromArray(result.rows);
    },

    create: async(incidentsLogs) => {
        const insertIncidentsLogsQuery =
        `
        INSERT INTO incidents_logs
        (incident_id, previous_status, current_status, comment, action_user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `
        const values = [
            incidentsLogs.incidentId,
            incidentsLogs.previousStatus,
            incidentsLogs.currentStatus,
            incidentsLogs.comment,
            incidentsLogs.actionUserId
        ]
        const result = await pool.query(insertIncidentsLogsQuery, values);

        return new IncidentsLogs(result.rows[0]);
    }

};