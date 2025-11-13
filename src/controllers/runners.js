import { RunnerService, RunnerLogService } from '../services/runners.js';
import { ResponseRunnersDto, ResponseRunnerLogsDto } from '../dto/runners/response-runners-dto.js';
import { CreateRunnersDto, CreateRunnerLogsDto } from '../dto/runners/create-runners-dto.js';

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
    }
}

export const RunnerLogsController = {
    getAllRunnersLogs: async (req, res) => {
        const runnersLogs = await RunnerLogService.getAllRunnersLogs();
        
        const response = ResponseRunnerLogsDto.fromArray(runnersLogs);

        return res.status(200).json(response);
    },

    createRunnerLog: async (req, res) => {
        const runnerLogData = req.body;

        const dto = new CreateRunnerLogsDto(runnerLogData).validate();

        const newRunnerLog = await RunnerLogService.createRunnerLog(dto);

        const response = new ResponseRunnerLogsDto(newRunnerLog);

        return res.status(201).json(response);
    }
}