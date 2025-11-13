import { RunnerService } from '../services/runners.js';
import { ResponseRunnersDto } from '../dto/runners/response-runners-dto.js';

export const RunnersController = {
    getAllRunners: async (req, res) => {
        const runners = await RunnerService.getAllRunners();

        const response = ResponseRunnersDto.fromArray(runners);

        return res.status(200).json(response);
    },
}