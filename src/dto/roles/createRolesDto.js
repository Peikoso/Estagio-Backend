import { ValidationError } from "../../utils/errors.js";

export class CreateRolesDto {
    constructor(role) {
        this.name = role.name;
        this.color = role.color;
        this.description = role.description;
    }
    
    validate() {
        if (typeof this.name !== 'string' || this.name.trim() === '') {
            throw new ValidationError('Name must be a non-empty string');
        }
        if (typeof this.color !== 'string' || this.color.trim() === '') {
            throw new ValidationError('Color must be a non-empty string');
        }
        if (typeof this.description !== 'string' || this.description.trim() === '') {
            throw new ValidationError('Description must be a non-empty string');
        }

        return this;
    }
}