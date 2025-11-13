import { pool } from '../config/database-conn.js';
import { Runners, RunnerLogs } from '../models/runners.js';

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

    findById: async (id) => {
        const selectIdQuery = 
        `
        SELECT * FROM runners
        WHERE id = $1
        `;

        const result = await pool.query(selectIdQuery, [id]);

        if(!result.rows[0]){
            return null;
        }

        return new Runners(result.rows[0]);
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
            runner.ruleId,
            runner.status,
            runner.lastRunAt,
            runner.nextRunAt
        ];

        const result =  await pool.query(insertRunnerQuery, values);
        
        return new Runners(result.rows[0]);
    }
};

export const RunnerLogsRepository = {
    findAll: async () => {
        const result = await pool.query(
            `
            SELECT * FROM runner_logs
            ORDER BY executed_at DESC;
            `
        );

        return RunnerLogs.fromArray(result.rows);
    },

    create: async (runnerLog) => {
        const insertQuery = 
        `
        INSERT INTO runner_logs
        (runner_id, run_time_ms, result, error, executed_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `

        const values = [
            runnerLog.runnerId,
            runnerLog.runTimeMs,
            runnerLog.result,
            runnerLog.error,
            runnerLog.executedAt
        ];

        const result = await pool.query(insertQuery, values);

        return new RunnerLogs(result.rows[0]);
    }
}
