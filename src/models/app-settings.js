export class AppSettings {
    constructor(appSettings){
        this.key = appSettings.key;
        this.value = appSettings.value;
        this.createdAt = appSettings.created_at ?? appSettings.createdAt;
        this.updatedAt = appSettings.updated_at ?? appSettings.updatedAt;
    }

    static fromArray(appSettings){
        return appSettings.map(appSetting => new AppSettings(appSetting));
    }
};