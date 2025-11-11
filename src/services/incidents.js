import { IncidentsRepository, IncidentsLogsRepository } from "../repositories/incidents.js";
import { Incidents, IncidentsLogs } from '../models/incidents.js';
import { isValidUuid } from "../utils/valid_uuid.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";
import { RoleService } from "./roles.js";
import { RuleService } from "./rules.js";
import { UserService } from "./users.js";


export const IncidentService = {
    getAllIncidents: async () => {
        const incidents = await IncidentsRepository.findAll();

        return incidents;
    },

    getIncidentById: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid Incident UUID.');
        }

        const incident = await IncidentsRepository.findById(id);

        if(!incident){
            throw new NotFoundError('Incident not found.');
        }

        return incident;

    },

    getIncidentesLogsByIncidentId: async (incidentId) => {
        if(!isValidUuid(incidentId)){
            throw new ValidationError('Invalid Incident UUID.');
        }

        const incidentLogs = await IncidentsLogsRepository.findByIncidentId(incidentId);

        return incidentLogs;
    },

    createIncident: async (dto) => {
        const newIncident = new Incidents(dto);

        await UserService.getUserById(newIncident.assignedUserId);
        await RuleService.getRuleById(newIncident.ruleId);

        for(const roleId of newIncident.roles){
            await RoleService.getRoleById(roleId);
        }

        const savedIncident = await IncidentsRepository.create(newIncident);

        return savedIncident;
    }, 

    createIncidentsAction: async (dto) => {
        const newIncidentsLogs = new IncidentsLogs(dto);
        
        await UserService.getUserById(newIncidentsLogs.actionUserId);
        const incident = await IncidentService.getIncidentById(newIncidentsLogs.incidentId);
        
        newIncidentsLogs.nextStatus(incident.status);
        const savedIncidentsLogs = await IncidentsLogsRepository.create(newIncidentsLogs);
        
        incident.updateStatus(savedIncidentsLogs);
        await IncidentsRepository.update(incident);

        return savedIncidentsLogs;
    }

}