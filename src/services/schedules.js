import { SchedulesRepository } from "../repositories/schedules.js";
import { Schedules, ScheduleLogs } from "../models/schedules.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { isValidUuid } from "../utils/validations.js";
import { UserService } from "./users.js";

export const ScheduleService = {
    getUpcomingSchedules: async () => {
        const date = new Date().toISOString().split('T')[0];
        
        return await SchedulesRepository.findUpcomingSchedules(date);
    },

    getScheduleById: async (id) => {
        if(!isValidUuid(id)) {
            throw new ValidationError(`Invalid UUID.`);
        }

        const schedule =  await SchedulesRepository.findById(id);

        if(!schedule) {
            throw new NotFoundError(`Schedule not found.`);
        }

        return schedule;
    },

    createSchedule: async (dto) => {
        const newSchedule = new Schedules(dto).validateBusinessLogic();

        await UserService.getUserById(newSchedule.userId);

        const savedSchedule = await SchedulesRepository.create(newSchedule);
        
        return savedSchedule;
    }

};