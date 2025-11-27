import { RunnerService, RunnerLogService, RunnerQueueService } from '../services/runners.js';
import { ResponseRunnersDto, ResponseRunnerLogsDto, ResponseRunnerQueueDto } from '../dto/runners/response-runners-dto.js';
import { CreateRunnersDto, CreateRunnerLogsDto, CreateRunnerQueueDto } from '../dto/runners/create-runners-dto.js';
import { UpdateRunnerQueueDto } from '../dto/runners/update-runners-dto.js';

export const RunnersController = {
    getAllRunners: async (req, res) => {
        const currentUserFirebaseUid = req.user.uid;
        const { ruleName, status, priority, databaseType, page, perPage } = req.query;

        const runners = await RunnerService.getAllRunners(
            currentUserFirebaseUid, ruleName, status, priority, databaseType, page, perPage
        );

        const response = ResponseRunnersDto.fromArray(runners);

        return res.status(200).json(response);
    },

    /*createRunner: async (req, res) => {
        const currentUserFirebaseUid = req.user.uid;
        const runnerData = req.body;

        const dto = new CreateRunnersDto(runnerData).validate();

        const newRunner = await RunnerService.createRunner(dto, currentUserFirebaseUid);

        const response = new ResponseRunnersDto(newRunner);

        return res.status(201).json(response);
    },

    updateRunner: async (req, res) => {
        const currentUserFirebaseUid = req.user.uid;
        const id = req.params.id;
        const runnerData = req.body;

        const dto = new CreateRunnersDto(runnerData).validate();

        const updatedRunner = await RunnerService.updateRunner(id, dto, currentUserFirebaseUid);

        const response = new ResponseRunnersDto(updatedRunner);

        return res.status(200).json(response);
    },

    deleteRunner: async (req, res) => {
        const currentUserFirebaseUid = req.user.uid;
        const runnerId = req.params.id;

        await RunnerService.deleteRunner(runnerId, currentUserFirebaseUid);

        return res.status(204).send();
    }*/
};

export const RunnerQueueController = {
    getAllRunnerQueue: async (req, res) => {
        const currentUserFirebaseUid = req.user.uid;
        const { ruleName, status, rulePriority, page, perPage } = req.query;

        const runnerQueue = await RunnerQueueService.getAllRunnerQueue(
            currentUserFirebaseUid, ruleName, status, rulePriority, page, perPage
        );

        const response = ResponseRunnerQueueDto.fromArray(runnerQueue);

        return res.status(200).json(response);
    },

    /*createRunnerQueue: async (req, res) => {
        const runnerQueueData = req.body;

        const dto = new CreateRunnerQueueDto(runnerQueueData).validate();

        const newRunnerQueue = await RunnerQueueService.createRunnerQueue(dto);

        const response = new ResponseRunnerQueueDto(newRunnerQueue);

        return res.status(201).json(response);
    },

    updateRunnerQueue: async (req, res) => {
        const id = req.params.id;
        const runnerQueueData = req.body;

        const dto = new UpdateRunnerQueueDto(runnerQueueData).validate();

        const updatedRunnerQueue = await RunnerQueueService.updateRunnerQueue(id, dto);

        const response = new ResponseRunnerQueueDto(updatedRunnerQueue);

        return res.status(200).json(response);
    },

    deleteRunnerQueue: async (req, res) => {
        const runnerQueueId = req.params.id;

        await RunnerQueueService.deleteRunnerQueue(runnerQueueId);

        return res.status(204).send();
    }*/
};

export const RunnerLogsController = {
    getAllRunnersLogs: async (req, res) => {
        const runnersLogs = await RunnerLogService.getAllRunnersLogs();
        
        const response = ResponseRunnerLogsDto.fromArray(runnersLogs);

        return res.status(200).json(response);
    },


    /*createRunnerLog: async (req, res) => {
        const runnerLogData = req.body;

        const dto = new CreateRunnerLogsDto(runnerLogData).validate();

        const newRunnerLog = await RunnerLogService.createRunnerLog(dto);

        const response = new ResponseRunnerLogsDto(newRunnerLog);

        return res.status(201).json(response);
    }*/
};