import { ValidationError } from '../utils/errors.js'

export class Roles {
    constructor(role){
        this.id = role.id;
        this.name = role.name;
        this.color = role.color;
        this.description = role.description;
        this.created_at = role.created_at;
        this.updated_at = role.updated_at;
    }

    validateBusinessRules(){
        const COLOR_REGEX = /^#([0-9A-F]{3}){1,2}$/i;

        if(this.name.length > 20){
            throw new ValidationError('Role name cannot exceed 20 characters');
        }
        if(!COLOR_REGEX.test(this.color)){
            throw new ValidationError('Role color must be a valid hex code');
        }
        if(this.color.length > 20){
            throw new ValidationError('Role color cannot exceed 20 characters');
        }
        if(this.description.length > 150){
            throw new ValidationError('Role description cannot exceed 150 characters');
        }
    }
}