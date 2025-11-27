import { Runners, RunnerLogs, RunnerQueue } from "../models/runners.js";
import { RunnersRepository, RunnerLogsRepository, RunnerQueueRepository } from "../repositories/runners.js";
import { ValidationError } from "../utils/errors.js";
import { isValidUuid } from "../utils/validations.js";
import { AuthService } from "./auth.js";
import { RuleService } from "./rules.js";


export const RunnerService = {
    getAllRunners: async (
        currentUserFirebaseUid, ruleName, status, priority, databaseType, page, perPage
    ) => {
        await AuthService.requireAdmin(currentUserFirebaseUid)

        const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
        const limit = parseInt(perPage) > 0 ? parseInt(perPage) : 10;
        const offset = (pageNumber - 1) * limit;

        const runners = await RunnersRepository.findAll(
            ruleName, status, priority, databaseType, limit, offset
        );

        return runners;
    },

    createRunnerForRule: async (ruleId, client) => {
        const newRunner = new Runners({
            ruleId: ruleId,
            status: 'IDLE',
            lastRunAt: null,
        });

        const savedRunner = await RunnersRepository.create(newRunner, client);

        return savedRunner;
    },

    /*getRunnerById: async (id, currentUserFirebaseUid) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid Runner UUID.')
        }

        await AuthService.requireAdmin(currentUserFirebaseUid);

        const runner = await RunnersRepository.findById(id);

        if(!runner){
            throw new ValidationError('Runner not found.');
        }

        return runner;
    },

    createRunner: async (dto, currentUserFirebaseUid) => {
        const newRunner = new Runners(dto);
        
        await RuleService.getRuleById(newRunner.ruleId, currentUserFirebaseUid);

        const savedRunner = await RunnersRepository.create(newRunner);

        return savedRunner;
    },

    updateRunner: async (id, dto, currentUserFirebaseUid) => {
        const existingRunner = await RunnerService.getRunnerById(id, currentUserFirebaseUid);

        const updatedRunner = new Runners({
            ...existingRunner,
            ...dto,
            updatedAt: new Date()
        });

        await RuleService.getRuleById(updatedRunner.ruleId);

        const savedRunner = await RunnersRepository.update(updatedRunner);

        return savedRunner;
    },

    deleteRunner: async (id, currentUserFirebaseUid) => {
        await RunnerService.getRunnerById(id, currentUserFirebaseUid);

        await RunnersRepository.delete(id);
    }*/
};

export const RunnerQueueService = {
    getAllRunnerQueue: async (
        currentUserFirebaseUid, ruleName, status, rulePriority, page, perPage
    ) => {
        await AuthService.requireAdmin(currentUserFirebaseUid);

        const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
        const limit = parseInt(perPage) > 0 ? parseInt(perPage) : 10;
        const offset = (pageNumber - 1) * limit;

        const runnerQueue = await RunnerQueueRepository.findAll(
            ruleName, status, rulePriority, limit, offset
        );

        return runnerQueue;
    },

    /*getRunnerQueueById: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid Runner Queue UUID.')
        }

        const runnerQueue = await RunnerQueueRepository.findById(id);

        if(!runnerQueue){
            throw new ValidationError('Runner Queue not found.');
        }

        return runnerQueue;
    },

    createRunnerQueue: async (dto) => {
        const newRunnerQueue = new RunnerQueue(dto).validateBusinessLogic();

        await RunnerService.getRunnerById(newRunnerQueue.runnerId);

        const savedRunnerQueue = await RunnerQueueRepository.create(newRunnerQueue);

        return savedRunnerQueue;
    },

    updateRunnerQueue: async (id, dto) => {
        const existingRunnerQueue = await RunnerQueueService.getRunnerQueueById(id);

        const updatedRunnerQueue = new RunnerQueue({
            ...existingRunnerQueue,
            ...dto,
        }).validateBusinessLogic();

        await RunnerService.getRunnerById(updatedRunnerQueue.runnerId);

        const savedRunnerQueue = await RunnerQueueRepository.update(updatedRunnerQueue);

        return savedRunnerQueue;
    },

    deleteRunnerQueue: async (id) => {
        await RunnerQueueService.getRunnerQueueById(id);

        await RunnerQueueRepository.delete(id);
    }*/
};

export const RunnerLogService = {
    getAllRunnersLogs: async () => {
        const runnersLogs = await RunnerLogsRepository.findAll();

        return runnersLogs;
    },

    /*createRunnerLog: async (dto) => {
        const newRunnerLog = new RunnerLogs(dto).validateBusinessLogic();

        await RunnerService.getRunnerById(newRunnerLog.runnerId);
        await RunnerQueueService.getRunnerQueueById(newRunnerLog.queueId);

        const savedRunnerLog = await RunnerLogsRepository.create(newRunnerLog);

        return savedRunnerLog;
    }*/
};