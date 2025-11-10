export class ResponseRolesDto {
    constructor(role) {
        this.id = role.id;
        this.name = role.name;
        this.color = role.color;
        this.description = role.description;
        this.created_at = role.created_at;
        this.updated_at = role.updated_at;
    }

    static fromArray(rolesArray) {
        return rolesArray.map(role => new ResponseRolesDto(role));
    }
}