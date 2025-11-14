export class ResponseUserPreferencesDto {
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

    static fromArray(preferencesArray) {
        return preferencesArray.map((preferences) => new ResponseUserPreferencesDto(preferences));
    }

};