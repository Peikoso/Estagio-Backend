import { IncidentService } from '../services/incidents.js';
import { CreateIncidentsDto, CreateIncidentsLogsDto } from '../dto/incidents/create-incidents-dto.js';
import { ResponseIncidentsDto, ResponseIncidentsLogsDto } from '../dto/incidents/response-incidents-dto.js';

export const IncidentsController = {
    getAllIncidents: async(req, res) => {
        try {
            const incidents = await IncidentService.getAllIncidents();

            const response = ResponseIncidentsDto.fromArray(incidents);

            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error.' })
        }
    },

    getIncidentById: async(req, res) => {
        try {
            const id = req.params.id

            const incident = await IncidentService.getIncidentById(id);

            const response = new ResponseIncidentsDto(incident);

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

    getIncidentLogsByIncidentId: async(req, res) => {
        try {
            const id = req.params.id;

            const incidentLogs = await IncidentService.getIncidentesLogsByIncidentId(id);

            const response = ResponseIncidentsLogsDto.fromArray(incidentLogs);

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

    createIncident: async(req, res) => {
        try {
            const incidentData = req.body;

            const dto = new CreateIncidentsDto(incidentData).validate();

            const newIncident = await IncidentService.createIncident(dto);

            const response = new ResponseIncidentsDto(newIncident);

            return res.status(201).json(response);
        } catch (error) {
            if(error.name === 'ValidationError'){
                return res.status(error.status).json({error: error.message});
            }
            if(error.name === 'NotFoundError'){
                return res.status(error.status).json({ error: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createIncidentsAction: async(req, res) => {
        try {
            const incidentLogData = req.body;

            const dto = new CreateIncidentsLogsDto(incidentLogData).validate();

            const newIncidentLog = await IncidentService.createIncidentsAction(dto);

            const response = new ResponseIncidentsLogsDto(newIncidentLog);

            return res.status(201).json(response);
        } catch (error) {
            if(error.name === 'ValidationError'){
                return res.status(error.status).json({error: error.message});
            }
            if(error.name === 'NotFoundError'){
                return res.status(error.status).json({ error: error.message });
            }
            if(error.name === 'BusinessLogicError'){
                return res.status(error.status).json({ error: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}