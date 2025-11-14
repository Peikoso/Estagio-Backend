import { BusinessLogicError } from "../utils/errors.js";

export class UserPreferences {
    constructor(preferences) {
        this.id = preferences.id;
        this.userId = preferences.user_id ?? preferences.userId;
        this.dndStartTime = preferences.dnd_start_time ?? preferences.dndStartTime;
        this.dndEndTime = preferences.dnd_end_time ?? preferences.dndEndTime;
        this.pushEnabled = preferences.push_enabled ?? preferences.pushEnabled;
        this.emailEnabled = preferences.email_enabled ?? preferences.emailEnabled;
        this.comuniqEnabled = preferences.comuniq_enabled ?? preferences.comuniqEnabled;
        this.pushSoundEnabled = preferences.push_sound_enabled ?? preferences.pushSoundEnabled;
        this.createdAt = preferences.created_at ?? preferences.createdAt;
        this.updatedAt = preferences.updated_at ?? preferences.updatedAt;
    }

    static fromArray(preferencesArray) {
        return preferencesArray.map((preferences) => new UserPreferences(preferences));
    }
    
    validateBusinessLogic() {
        if (this.dndStartTime >= this.dndEndTime) {
            throw new BusinessLogicError('DND start time must be before DND end time');
        }
    }
};