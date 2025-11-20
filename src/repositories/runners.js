import { pool } from '../config/database-conn.js';
import { Runners, RunnerQueue, RunnerLogs } from '../models/runners.js';

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

export const RunnerQueueRepository = {
    findAll: async () => {
        const result = await pool.query(
            `
            SELECT * FROM runner_queue
            ORDER BY scheduled_for DESC;
            `
        );

        return RunnerQueue.fromArray(result.rows);
    },

    findById: async (id) => {
        const selectIdQuery = 
        `
        SELECT * FROM runner_queue
        WHERE id = $1
        `;

        const result = await pool.query(selectIdQuery, [id]);

        if(!result.rows[0]){
            return null;
        }

        return new RunnerQueue(result.rows[0]);
    },

    create: async (runnerQueue) => {
        const insertQuery = 
        `
        INSERT INTO runner_queue
        (runner_id, scheduled_for)
        VALUES ($1, $2)
        RETURNING *;
        `

        const values = [
            runnerQueue.runnerId,
            runnerQueue.scheduledFor,
        ];

        const result = await pool.query(insertQuery, values);

        return new RunnerQueue(result.rows[0]);
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

    findByRunnerId: async (runnerId) => {
        const selectQuery = 
        `
        SELECT * FROM runner_logs
        WHERE runner_id = $1
        ORDER BY executed_at DESC;
        `;

        const result = await pool.query(selectQuery, [runnerId]);

        return RunnerLogs.fromArray(result.rows);
    },

    create: async (runnerLog) => {
        const insertQuery = 
        `
        INSERT INTO runner_logs
        (runner_id, queue_id, run_time_ms, execution_status, rows_affected, result, error, executed_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
        `

        const values = [
            runnerLog.runnerId,
            runnerLog.queueId,
            runnerLog.runTimeMs,
            runnerLog.executionStatus,
            runnerLog.rowsAffected, 
            runnerLog.result,
            runnerLog.error,
            runnerLog.executedAt
        ];

        const result = await pool.query(insertQuery, values);

        return new RunnerLogs(result.rows[0]);
    }
}
