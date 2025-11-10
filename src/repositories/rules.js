import { pool } from '../config/database_conn.js';

export const RuleRepository = {
    findAll: async () => {
        const result = await pool.query(
            `
            SELECT r.*, array_agg(rr.role_id) AS roles 
            FROM rules r 
            LEFT JOIN rules_roles rr 
            ON r.id = rr.rule_id 
            GROUP BY r.id
            ORDER BY created_at DESC;
            `
        );

        return result.rows;
    },

    findById: async (id) => {
        const selectIdQuery = 
        `
        SELECT r.*, array_agg(rr.role_id) AS roles 
        FROM rules r 
        LEFT JOIN rules_roles rr 
        ON r.id = rr.rule_id 
        WHERE r.id = $1
        GROUP BY r.id;
        `;

       const result = await pool.query(selectIdQuery, [id]);

       return result.rows[0];
    },

    create: async (ruleData) => {
        const insertRuleQuery = 
        `
        INSERT INTO rules
        (name, description, sql, priority, execution_interval_ms, max_error_count, timeout_ms, start_time, end_time, notification_enabled, is_active, silence_mode, postpone_date, user_creator_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id; 
        `;
        
        const values = [
            ruleData.name,
            ruleData.description,
            ruleData.sql,
            ruleData.priority,
            ruleData.execution_interval_ms,
            ruleData.max_error_count,
            ruleData.timeout_ms,
            ruleData.start_time,
            ruleData.end_time,
            ruleData.notification_enabled,
            ruleData.is_active,
            ruleData.silence_mode,
            ruleData.postpone_date,
            ruleData.user_creator_id
        ];
        
        const ruleDB = await pool.query(insertRuleQuery, values);

        const insertRoleRuleQuery = ` INSERT INTO rules_roles (rule_id, role_id) VALUES ($1, $2); `;

        for (const roleId of ruleData.roles) {
            await pool.query(insertRoleRuleQuery, [ruleDB.rows[0].id, roleId]);
        }

        const ruleWithRolesQuery = 
        `
        SELECT r.*, array_agg(rr.role_id) AS roles
        FROM rules r
        LEFT JOIN rules_roles rr 
        ON r.id = rr.rule_id
        WHERE r.id = $1
        GROUP BY r.id;
        `;

        const result = await pool.query(ruleWithRolesQuery, [ruleDB.rows[0].id]);
        return result.rows[0];
    },

    update: async (id, ruleData) => {
        // Lógica para atualizar uma regra existente no banco de dados
    },

    delete: async (id) => {
        // Lógica para deletar uma regra do banco de dados
    }
};