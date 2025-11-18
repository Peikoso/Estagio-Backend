export class CreateAppSettingsDto {
    constructor(appSettings){
        this.key = appSettings.key;
        this.value = appSettings.value;
    }

    validate() {
        if (typeof this.key !== 'string' || this.key.trim() === '') {
            throw new Error('Key must be a non-empty string.');
        }
        if (typeof this.value !== 'object' || !this.value) {
            throw new Error('Value must be a JSON object.');
        }
    }
};