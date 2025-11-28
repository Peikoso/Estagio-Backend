import { RunnersRepository, RunnerQueueRepository } from '../repositories/runners.js';
import { RulesRepository } from '../repositories/rules.js';


class RunnerScheduler {
    constructor() {
        this.isRunning = false;
        this.checkInterval = 10000; //10 segundos
    }

    async start() {
        if (this.isRunning){
            console.log('[Runner Scheduler] Scheduler já está rodando.');
            return;
        }

        console.log('[Runner Scheduler] Iniciando scheduler...');
        this.isRunning = true;

        while(this.isRunning){
            try{
                await this.scheduleRunnersToQueue();
            } catch (error){
                console.error('[Runner Scheduler] Erro no agendamento:', error);
            }

            await this.sleep(this.checkInterval);
        }
    }

    stop() {
        console.log('[Runner Scheduler] Parando scheduler...')
        this.isRunning = false;
    }

    async scheduleRunnersToQueue(){
        const allRunners = await RunnersRepository.findAllForScheduling();
        console.log(`[Runner Scheduler] Verificando ${allRunners.length} runner(s) para agendamento...`);

        if (allRunners.length === 0){
            return;
        }

        let scheduledCount = 0;
        for (const runner of allRunners) {
            try{
                const wasScheduled = await this.scheduleRunner(runner);
                if(wasScheduled) scheduledCount++;
                await this.sleep(1000);
            } catch (error) {
                console.error(`[Runner Scheduler] Erro ao agendar runner ${runner.id}:`, error);
            }
        }

        if (scheduledCount > 0) {
            console.log(`[Runner Scheduler] ${scheduledCount} runner(s) agendado(s).`);
        }
    }

    async scheduleRunner(runner){
        const runnerId = runner.id;
        const ruleId = runner.ruleId;
        const lastRunAt = runner.lastRunAt

        const rule = await RulesRepository.findById(ruleId);

        const isActive = rule.isActive;
        if(!isActive){
            console.log(`[Runner Scheduler] Regra "${rule.name}" está inativa. Pulando agendamento.`);
            return false;
        }

        const postponeDate = rule.postponeDate
        if(postponeDate && new Date(postponeDate) > new Date()) {
            console.log(`[Runner Scheduler] Regra "${rule.name}" está adiada até ${postponeDate}. Pulando agendamento.`);
            return false;
        }

        if (!this.isWithinExecutionWindow(rule)) {
            console.log(`[Runner Scheduler] Regra "${rule.name}" está fora da janela de execução. Pulando agendamento.`);
            return false;
        }

        const executionIntervalMs = rule.executionIntervalMs;
        const now = Date.now();

        if(lastRunAt){
            const timeSinceLastRun = now - new Date(lastRunAt).getTime();
            if(timeSinceLastRun < executionIntervalMs){
                console.log(`[Runner Scheduler] Regra "${rule.name}" foi executada recentemente. Pulando agendamento.`);
                return false;
            }
        }

        const existingRunnerQueue = await RunnerQueueRepository.findPendingByRunnerId(runnerId);
        if(existingRunnerQueue){
            console.log(`[Runner Scheduler] Runner ${runnerId} já está na fila.`);
            return false;
        }

        await RunnerQueueRepository.create({
            runnerId: runnerId,
            scheduledFor: new Date()
        });

        console.log(`[Runner Scheduler] Runner agendado para regra: "${rule.name}" (intervalo: ${rule.executionIntervalMs / 1000 / 60 } minutos)`)

        await RunnersRepository.update(runner.updateStatus('SCHEDULED'));

        return true;
    }

    isWithinExecutionWindow(rule) {
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

        const startTime = rule.startTime;
        const endTime = rule.endTime;

        const current = this.timeToSeconds(currentTime);
        const start = this.timeToSeconds(startTime);
        const end = this.timeToSeconds(endTime);

        if (end < start) {
            return current >= start || current <= end;
        }

        return current >= start && current <= end;

    }

    timeToSeconds(timeString) {
        const [hours, minutes, segundos] = timeString.split(':').map(Number);
        return ((hours * 60 + minutes) * 60) + segundos;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

export const runnerScheduler = new RunnerScheduler();