import { pool } from '../config/database-conn.js';
import { Rules } from '../models/rules.js';

export const RulesRepository = {
    findAll: async () => {
        const result = await pool.query(
            `
            SELECT r.*, array_remove(array_agg(rr.role_id), NULL) AS roles 
            FROM rules r 
            LEFT JOIN rules_roles rr 
            ON r.id = rr.rule_id 
            GROUP BY r.id
            ORDER BY created_at DESC;
            `
        );

        return Rules.fromArray(result.rows);
    },

    findById: async (id) => {
        const selectIdQuery = 
        `
        SELECT r.*, array_remove(array_agg(rr.role_id), NULL) AS roles 
        FROM rules r 
        LEFT JOIN rules_roles rr 
        ON r.id = rr.rule_id 
        WHERE r.id = $1
        GROUP BY r.id;
        `;

        const result = await pool.query(selectIdQuery, [id]);

        if(!result.rows[0]){
            return null;
        }

        return new Rules(result.rows[0]);
    },

    create: async (rule) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const insertRuleQuery = 
            `
            INSERT INTO rules
            (name, description, sql, priority, execution_interval_ms, max_error_count, timeout_ms, start_time, end_time, notification_enabled, is_active, silence_mode, postpone_date, user_creator_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id; 
            `;
            
            const values = [
                rule.name,
                rule.description,
                rule.sql,
                rule.priority,
                rule.executionIntervalMs,
                rule.maxErrorCount,
                rule.timeoutMs,
                rule.startTime,
                rule.endTime,
                rule.notificationEnabled,
                rule.isActive,
                rule.silenceMode,
                rule.postponeDate,
                rule.userCreatorId
            ];
            
            const ruleDB = await client.query(insertRuleQuery, values);

            const insertRoleRuleQuery = ` INSERT INTO rules_roles (rule_id, role_id) VALUES ($1, $2); `;

            for (const roleId of rule.roles) {
                await client.query(insertRoleRuleQuery, [ruleDB.rows[0].id, roleId]);
            }

            const ruleWithRolesQuery = 
            `
            SELECT r.*, array_remove(array_agg(rr.role_id), NULL) AS roles
            FROM rules r
            LEFT JOIN rules_roles rr 
            ON r.id = rr.rule_id
            WHERE r.id = $1
            GROUP BY r.id;
            `;

            const result = await client.query(ruleWithRolesQuery, [ruleDB.rows[0].id]);

            await client.query('COMMIT');
            
            return new Rules(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    update: async (rule) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const updateRuleQuery = 
            `
            UPDATE rules
            SET name = $1,
                description = $2,
                sql = $3,
                priority = $4,
                execution_interval_ms = $5,
                max_error_count = $6,
                timeout_ms = $7,
                start_time = $8,
                end_time = $9,
                notification_enabled = $10,
                is_active = $11,
                silence_mode = $12,
                postpone_date = $13,
                updated_at = $14
            WHERE id = $15;
            `;

            const values = [
                rule.name,
                rule.description,
                rule.sql,
                rule.priority,
                rule.executionIntervalMs,
                rule.maxErrorCount,
                rule.timeoutMs,
                rule.startTime,
                rule.endTime,
                rule.notificationEnabled,
                rule.isActive,
                rule.silenceMode,
                rule.postponeDate,
                rule.updatedAt,
                rule.id
            ];

            await client.query(updateRuleQuery, values);

            const deleteRolesQuery = ` DELETE FROM rules_roles WHERE rule_id = $1; `;
            await client.query(deleteRolesQuery, [rule.id]);

            const insertRoleRuleQuery = ` INSERT INTO rules_roles (rule_id, role_id) VALUES ($1, $2); `;

            for (const roleId of rule.roles) {
                await client.query(insertRoleRuleQuery, [rule.id, roleId]);
            }

            const ruleWithRolesQuery = 
            `
            SELECT r.*, array_remove(array_agg(rr.role_id), NULL) AS roles
            FROM rules r
            LEFT JOIN rules_roles rr 
            ON r.id = rr.rule_id
            WHERE r.id = $1
            GROUP BY r.id;
            `;

            const result = await client.query(ruleWithRolesQuery, [rule.id]);

            await client.query('COMMIT');
            
            return new Rules(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    },

    delete: async (id) => {
        const deleteQuery = ` DELETE FROM rules WHERE id = $1; `;

        await pool.query(deleteQuery, [id]);
    }
};