import { ValidationError } from "../../utils/errors.js";
import { validateTimeFormat } from "../../utils/validations.js";

export class CreateUserPreferencesDto {
    constructor(preferences) {
        this.id = preferences.id;
        this.userId = preferences.user_id ?? preferences.userId;
        this.dndStartTime = preferences.dnd_start_time ?? preferences.dndStartTime;
        this.dndEndTime = preferences.dnd_end_time ?? preferences.dndEndTime;
        this.pushEnabled = preferences.push_enabled ?? preferences.pushEnabled;
        this.emailEnabled = preferences.email_enabled ?? preferences.emailEnabled;
        this.comuniqEnabled = preferences.comuniq_enabled ?? preferences.comuniqEnabled;
        this.pushSoundEnabled = preferences.push_sound_enabled ?? preferences.pushSoundEnabled;
    }
    
    validate() {
        if (!validateTimeFormat(this.dndStartTime)) {
            throw new ValidationError('DND start time must be in HH:MM:SS format');
        }
        if (!validateTimeFormat(this.dndEndTime)) {
            throw new ValidationError('DND end time must be in HH:MM:SS format');
        }
        if (typeof this.pushEnabled !== 'boolean') {
            throw new ValidationError('Push enabled must be a boolean');
        }
        if (typeof this.emailEnabled !== 'boolean') {
            throw new ValidationError('Email enabled must be a boolean');
        }
        if (typeof this.comuniqEnabled !== 'boolean') {
            throw new ValidationError('Comuniq enabled must be a boolean');
        }
        if (typeof this.pushSoundEnabled !== 'boolean') {
            throw new ValidationError('Push sound enabled must be a boolean');
        }
    }
};