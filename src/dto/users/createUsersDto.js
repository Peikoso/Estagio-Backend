import { ValidationError } from '../../utils/errors.js';

export class CreateUsersDto {
    constructor(user){
        this.name = user.name;
        this.matricula = user.matricula;
        this.email = user.email;
        this.profile = user.profile ?? 'viewer';
        this.roles = user.roles ?? [];
        this.pending = user.pending ?? true;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;
    }

    validate() {
        if(typeof this.name !== 'string' || this.name.trim() === '') {
            throw new ValidationError('Name is required and must be a non-empty string');
        }
        if(typeof this.matricula !== 'string' || this.matricula.trim() === '') {
            throw new ValidationError('Matricula is required and must be a non-empty string');
        }
        if(typeof this.email !== 'string' || this.email.trim() === '') {
            throw new ValidationError('Email is required and must be a non-empty string');
        }
        if(typeof this.profile !== 'string' || this.profile.trim() === '') {
            throw new ValidationError('Profile is required and must be a non-empty string');
        }
        if(!Array.isArray(this.roles) || !this.roles.every(role => typeof role === 'string')) {
            throw new ValidationError('Roles must be a non-empty array of strings or a empty array');
        }

        return this;
    }
}