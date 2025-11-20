import { Runners, RunnerLogs, RunnerQueue } from "../models/runners.js";
import { RunnersRepository, RunnerLogsRepository, RunnerQueueRepository } from "../repositories/runners.js";
import { RuleService } from "./rules.js";
import { ValidationError } from "../utils/errors.js";
import { isValidUuid } from "../utils/validations.js";


export const RunnerService = {
    getAllRunners: async () => {
        const runners = await RunnersRepository.findAll();

        return runners;
    },

    getRunnerById: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid Runner UUID.')
        }

        const runner = await RunnersRepository.findById(id);

        if(!runner){
            throw new ValidationError('Runner not found.');
        }

        return runner;
    },

    createRunner: async (dto) => {
        const newRunner = new Runners(dto).validateBusinessLogic();
        
        await RuleService.getRuleById(newRunner.ruleId);

        const savedRunner = await RunnersRepository.create(newRunner);

        return savedRunner;
    }
};

export const RunnerQueueService = {
    getAllRunnerQueue: async () => {
        const runnerQueue = await RunnerQueueRepository.findAll();

        return runnerQueue;
    },

    getRunnerQueueById: async (id) => {
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
};

export const RunnerLogService = {
    getAllRunnersLogs: async () => {
        const runnersLogs = await RunnerLogsRepository.findAll();

        return runnersLogs;
    },

    getRunnerLogsByRunnerId: async (runnerId) => {
        if(!isValidUuid(runnerId)){
            throw new ValidationError('Invalid Runner UUID.')
        }

        const runnerLogs = await RunnerLogsRepository.findByRunnerId(runnerId);

        return runnerLogs;
    },

    createRunnerLog: async (dto) => {
        const newRunnerLog = new RunnerLogs(dto).validateBusinessLogic();

        await RunnerService.getRunnerById(newRunnerLog.runnerId);
        await RunnerQueueService.getRunnerQueueById(newRunnerLog.queueId);

        const savedRunnerLog = await RunnerLogsRepository.create(newRunnerLog);

        return savedRunnerLog;
    }
};