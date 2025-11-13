import { Runners } from "../models/runners.js";
import { RunnersRepository } from "../repositories/runners.js";

export const RunnerService = {
    getAllRunners: async () => {
        const runners = await RunnersRepository.findAll();

        return runners;
    },

    createRunner: async (ruleId, status) => {
        const runnerData = {
            ruleId: ruleId,
            status: status
        };

        const newRunner = new Runners(runnerData);

        const savedRunner = await RunnersRepository.create(newRunner);

        return savedRunner;
    }
};

export const RunnerLogService = {
    //Lógica a ser implementada
};