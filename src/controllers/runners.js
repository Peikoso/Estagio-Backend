import { RunnerService, RunnerLogService, RunnerQueueService } from '../services/runners.js';
import { ResponseRunnersDto, ResponseRunnerLogsDto, ResponseRunnerQueueDto } from '../dto/runners/response-runners-dto.js';
import { CreateRunnersDto, CreateRunnerLogsDto, CreateRunnerQueueDto } from '../dto/runners/create-runners-dto.js';

export const RunnersController = {
    getAllRunners: async (req, res) => {
        const runners = await RunnerService.getAllRunners();

        const response = ResponseRunnersDto.fromArray(runners);

        return res.status(200).json(response);
    },

    createRunner: async (req, res) => {
        const runnerData = req.body;

        const dto = new CreateRunnersDto(runnerData).validate();

        const newRunner = await RunnerService.createRunner(dto);

        const response = new ResponseRunnersDto(newRunner);

        return res.status(201).json(response);
    },

    updateRunner: async (req, res) => {
        const id = req.params.id;
        const runnerData = req.body;

        const dto = new CreateRunnersDto(runnerData).validate();

        const updatedRunner = await RunnerService.updateRunner(id, dto);

        const response = new ResponseRunnersDto(updatedRunner);

        return res.status(200).json(response);
    },

    deleteRunner: async (req, res) => {
        const runnerId = req.params.id;

        await RunnerService.deleteRunner(runnerId);

        return res.status(204).send();
    }
};

export const RunnerQueueController = {
    getAllRunnerQueue: async (req, res) => {
        const runnerQueue = await RunnerQueueService.getAllRunnerQueue();

        const response = ResponseRunnerQueueDto.fromArray(runnerQueue);

        return res.status(200).json(response);
    },

    createRunnerQueue: async (req, res) => {
        const runnerQueueData = req.body;

        const dto = new CreateRunnerQueueDto(runnerQueueData).validate();

        const newRunnerQueue = await RunnerQueueService.createRunnerQueue(dto);

        const response = new ResponseRunnerQueueDto(newRunnerQueue);

        return res.status(201).json(response);
    }
};

export const RunnerLogsController = {
    getAllRunnersLogs: async (req, res) => {
        const runnersLogs = await RunnerLogService.getAllRunnersLogs();
        
        const response = ResponseRunnerLogsDto.fromArray(runnersLogs);

        return res.status(200).json(response);
    },

    getRunnerLogsByRunnerId: async (req, res) => {
        const runnerId = req.params.id;

        const runnerLogs = await RunnerLogService.getRunnerLogsByRunnerId(runnerId);

        const response = ResponseRunnerLogsDto.fromArray(runnerLogs);

        return res.status(200).json(response);
    },

    createRunnerLog: async (req, res) => {
        const runnerLogData = req.body;

        const dto = new CreateRunnerLogsDto(runnerLogData).validate();

        const newRunnerLog = await RunnerLogService.createRunnerLog(dto);

        const response = new ResponseRunnerLogsDto(newRunnerLog);

        return res.status(201).json(response);
    }
};