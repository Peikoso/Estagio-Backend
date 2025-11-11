export class Incidents {
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

    static fromArray(incidentsArray) {
        return incidentsArray.map(incident => new Incidents(incident));
    }
}