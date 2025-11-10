export class ResponseIncidentsDto {
    constructor(incident) {        
        this.id = incident.id;
        this.assignedUserId = incident.assignedUserId;
        this.ruleId = incident.ruleId;
        this.status = incident.status;
        this.priority = incident.priority;
        this.ackAt = incident.ackAt;
        this.closedAt = incident.closedAt;
        this.createdAt = incident.createdAt;
        this.updatedAt = incident.updatedAt;
    }
    
    static fromArray(incidents) {
        return incidents.map(incident => new ResponseIncidentsDto(incident));
    }
}