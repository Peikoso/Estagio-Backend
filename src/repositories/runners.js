import { pool } from '../config/database.js';
import { Runners } from '../models/runners.js';

export const RunnersRepository = {
    findAll: async () => {
        const result = await pool.query(
            `
            SELECT * FROM runners
            ORDER BY created_at DESC;
            `
        );

        return Runners.fromArray(result.rows);
    },

    create: async (runner) => {
        const insertRunnerQuery = 
        `
        INSERT INTO runners
        (rule_id, status, last_run_at, next_run_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *; 
        `;

        const values = [
            runner.rule_id,
            runner.status,
            runner.last_run_at,
            runner.next_run_at
        ];

        const result =  await pool.query(insertRunnerQuery, values);
        
        return new Runners(result.rows[0]);
    }
};