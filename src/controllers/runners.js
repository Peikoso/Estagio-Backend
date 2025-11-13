import { RunnerService, RunnerLogService } from '../services/runners.js';
import { ResponseRunnersDto } from '../dto/runners/response-runners-dto.js';
import { CreateRunnerLogsDto } from '../dto/runners/create-runners-dto.js';

export const RunnersController = {
    getAllRunners: async (req, res) => {
        const runners = await RunnerService.getAllRunners();

        const response = ResponseRunnersDto.fromArray(runners);

        return res.status(200).json(response);
    },
}

export const RunnerLogsController = {
    getAllRunnersLogs: async (req, res) => {
        const runnersLogs = await RunnerLogService.getAllRunnersLogs();
        
        const response = ResponseRunnersDto.RunnerLogs.fromArray(runnersLogs);

        return res.status(200).json(response);
    },

    createRunnerLog: async (req, res) => {
        const runnerLogData = req.body;

        const dto = new CreateRunnerLogsDto(runnerLogData).validate();

        const newRunnerLog = await RunnerLogService.createRunnerLog(dto);

        const response = new ResponseRunnersDto.RunnerLogs(newRunnerLog);

        return res.status(201).json(response);
    }
}