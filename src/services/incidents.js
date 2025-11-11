import { IncidentsRepository } from "../repositories/incidents.js";
import { CreateIncidentsDto } from "../dto/incidents/createIncidentsDto.js";
import { ResponseIncidentsDto } from '../dto/incidents/responseIncidentsDto.js';
import { Incidents } from '../models/incidents.js';
import { isValidUuid } from "../utils/valid_uuid.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";
import { RoleService } from "./roles.js";

export const IncidentService = {
    getAllIncidents: async () => {
        const incidents = await IncidentsRepository.findAll();
        return ResponseIncidentsDto.fromArray(incidents);
    },

    getIncidentById: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid Incident UUID.');
        }

        const incident = await IncidentsRepository.findById(id);

        if(!incident){
            throw new NotFoundError('Incident not found.');
        }

        return new ResponseIncidentsDto(incident);

    },

    createIncident: async (incidentData) => {
        const dto = new CreateIncidentsDto(incidentData).validate();

        const newIncident = new Incidents(dto);

        for(roleId of newIncident.roles){
            await RoleService.getRoleById(roleId);
        }

        const savedIncident = await IncidentsRepository.create(newIncident);

        return new ResponseIncidentsDto(savedIncident);
    }
}