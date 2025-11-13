import { pool } from '../config/database-conn.js';
import { EscalationPolicy } from '../models/escalation-policies.js'

export const EscalationPoliciesRepository = {
    findAll: async () => {
        const result = await pool.query(
            `
            SELECT * FROM escalation_policy
            ORDER BY created_at DESC;
            `
        );

        return EscalationPolicy.fromArray(result.rows);
    },

    create: async(escalationPolicy) => {
        const insertQuery =
        `
        INSERT INTO escalation_policy
        (timeout_ms, role_id, is_active)
        VALUES ($1, $2, $3)
        RETURNING *;
        `;

        const values = [
            escalationPolicy.timeoutMs, 
            escalationPolicy.roleId, 
            escalationPolicy.isActive
        ];

        const result = await pool.query(insertQuery, values);

        return new EscalationPolicy(result.rows[0]);
    }
}