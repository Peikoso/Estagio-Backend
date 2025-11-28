import { pool } from '../config/database-conn.js';
import { RunnersRepository, RunnerQueueRepository, RunnerLogsRepository } from '../repositories/runners.js';
import { RulesRepository } from '../repositories/rules.js';


class RunnerWorker {
    constructor() {
        this.isRunning = false;
        this.checkInterval = 5000; //5 segundos
        this.maxConcurrentRunners = 3; // Limite de runners concorrentes
    }

    async start() {
        if (this.isRunning){
            console.log('[Runner Worker] Worker já está rodando.');
            return;
        }
        
        console.log('[Runner Worker] Iniciando worker...');
        this.isRunning = true;

        while(this.isRunning){
            try{
                await this.processRunnerQueue();
            } catch (error){
                console.error('[Runner Worker] Erro no processamento:', error);
            }
            
            await this.sleep(this.checkInterval);
        }
    }

    stop() {
        console.log('[Runner Worker] Parando worker...')
        this.isRunning = false;
    }

    async processRunnerQueue(){
        const pendingJobs = await RunnerQueueRepository.findPendingJobs(this.maxConcurrentRunners);

        if (pendingJobs.length === 0) {
            console.log('[Runner Worker] Nenhum runner pendente na fila.')
            return;
        }

        console.log(`[Runner Worker] ${pendingJobs.length} runner(s) encontrado(s).`);

        const promises = pendingJobs.map(job => this.executeRunner(job));
        await Promise.allSettled(promises)
        await this.sleep(1000);
    }

    async executeRunner(job){
        const startTime = Date.now();
        const queueId = job.id;
        const runnerId = job.runnerId;
        
        console.log(`[Runner Worker] Executando job ${queueId} (runner: ${runnerId})`);
        
        const runner = await RunnersRepository.findById(runnerId);

        const ruleId = runner.ruleId;
        const rule = await RulesRepository.findById(ruleId);

        try{
            await RunnerQueueRepository.update(job.start());
            await RunnersRepository.update(runner.updateStatus('RUNNING'));



            if (!rule.isActive) {
                console.log(`[Runner Worker] Regra ${ruleId} está inativa. Pulando execução.`);
                await RunnerQueueRepository.update(job.complete());
                return;
            }

            const executionResult = await this.executeSQLQuery(rule.sql, rule.timeoutMs);

            const runTimeMs = Date.now() - startTime;

            await RunnerLogsRepository.create({
                runnerId: runnerId,
                queueId: queueId,
                runTimeMs: runTimeMs,
                executionStatus: 'SUCCESS',
                rowsAffected: executionResult.rowsAffected || 0,
                result: JSON.stringify(executionResult.rows),
                error: null,
                executedAt: new Date()
            });

            await RunnersRepository.update(runner.idle());

            await RunnerQueueRepository.update(job.complete());

            console.log(`[Runner Worker] Job ${queueId} concluído com sucesso. Linhas afetadas: ${executionResult.rowsAffected}`);

            this.logMetrics({
                queueId,
                runnerId,
                ruleId,
                runTimeMs,
                status: 'SUCCESS',
                rowsAffected: executionResult.rowsAffected
            });
        } catch (error) {
            const runTimeMs = Date.now() - startTime
            console.error(`[Runner Worker] Erro ao executar job ${queueId}:`, error.message);

            await RunnerLogsRepository.create({
                runnerId: runnerId,
                queueId: queueId,
                runTimeMs: runTimeMs,
                executionStatus: error.message.includes('timeout') ? 'TIMEOUT' : 'ERROR',
                rowsAffected: 0,
                result: null,
                error: error.message,
                executedAt: new Date()
            });

            await RunnersRepository.update(runner.fail());

            const newAttemptCount = (job.attemptCount || 0) + 1;

            if (newAttemptCount >= 3) {
                await RunnerQueueRepository.update(job.fail(newAttemptCount));
            } else {
                await RunnerQueueRepository.update(job.retry(newAttemptCount));
            }

            this.logMetrics({
                queueId,
                runnerId,
                runTimeMs,
                status: 'ERROR',
                error: error.message
            });

        }

    }

    async executeSQLQuery(sql, timeoutMs){
        const client = await pool.connect();

        try{
            await client.query(`SET statement_timeout = ${timeoutMs}`);

            const result = await client.query(sql);

            return {
                rows: result.rows || [],
                rowsAffected: result.rowCount || 0
            };
        } finally {
            client.release();
        }
    }

    logMetrics(metrics) {
        console.log('[Runner Metrics]', JSON.stringify({
            timestamp: new Date().toISOString(),
            ...metrics
        }));
    }

    async sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const runnerWorker = new RunnerWorker();