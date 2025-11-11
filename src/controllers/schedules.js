import { ScheduleService } from '../services/schedules.js';
import { ResponseSchedulesDto } from '../dto/schedules/response-schedules-dto.js';
import { CreateSchedulesDto } from '../dto/schedules/create-schedules-dto.js';

export const SchedulesController = {
    getUpcomingSchedules: async(req, res) => {
        try {
            const schedules = await ScheduleService.getUpcomingSchedules();

            const response = ResponseSchedulesDto.fromArray(schedules);

            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error.' })
        }
    },

    getScheduleById: async(req, res) => {
        try {
            const id = req.params.id;

            const schedule = await ScheduleService.getScheduleById(id);

            const response = new ResponseSchedulesDto(schedule);

            return res.status(200).json(response);
        } catch (error) {
            if(error.name === 'NotFoundError'){
                res.status(error.status).json({error: error.message})
            }
            if(error.name === 'ValidationError'){
                return res.status(error.status).json({error: error.message});
            }
            console.error(error)
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createSchedule: async(req, res) => {
        try {
            const scheduleData = req.body;

            const dto = new CreateSchedulesDto(scheduleData).validate();

            const newSchedule = await ScheduleService.createSchedule(dto);

            const response = new ResponseSchedulesDto(newSchedule);

            return res.status(201).json(response);
        } catch (error) {
            if(error.name === 'NotFoundError'){
                res.status(error.status).json({error: error.message})
            }
            if(error.name === 'ValidationError'){
                return res.status(error.status).json({error: error.message});
            }
            if(error.name === 'BusinessLogicError'){
                return res.status(error.status).json({error: error.message});
            }
            console.error(error)
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};