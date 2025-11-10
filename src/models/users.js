import { ValidationError } from '../utils/errors.js';

export class Users {
    constructor(user){
        this.id = user.id;
        this.firebase_uid = user.firebase_uid;
        this.name = user.name;
        this.matricula = user.matricula;
        this.email = user.email;
        this.phone = user.phone;
        this.picture = user.picture;
        this.profile = user.profile;
        this.roles = user.roles;
        this.pending = user.pending;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;
        this.push_enabled = user.push_enabled;
        this.email_enabled = user.email_enabled;
        this.comuniq_enabled = user.comuniq_enabled;
        this.push_sound_enabled = user.push_sound_enabled;
    }


    validateBusinessRules() {
        const CELULAR_REGEX = /^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\d{4}[-]?\d{4})$/;
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const NAME_REGEX = /^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*$/;

        if (!NAME_REGEX.test(this.name)) {
            throw new ValidationError('Invalid name format');
        }
        if (!EMAIL_REGEX.test(this.email)) {
            throw new ValidationError('Invalid email format');
        }
        if (this.phone && !CELULAR_REGEX.test(this.phone)) {
            throw new ValidationError('Invalid phone format');
        }
        if(!(this.profile === 'admin' || this.profile === 'operator' || this.profile === 'viewer')) {
            throw new ValidationError('Profile must be admin, operator, or viewer');
        }

    }
}