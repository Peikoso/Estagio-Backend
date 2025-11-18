import { AppSettingService } from '../services/app-settings.js';
import { createAppSettingsDto } from '../dto/app_settings/create-app-settings-dto.js';
import { ResponseAppSettingsDto } from '../dto/app_settings/response-app-settings-dto.js';

export const AppSettingsController = {
    getAppSettingsByKey: async (req, res) => {
        const key = req.params.key;

        const appSettings = await AppSettingService.getAppSettingsByKey(key);

        const response = new ResponseAppSettingsDto(appSettings);

        return res.status(200).json(response);
    },

    createAppSettings: async (req, res) => {
        const appSettingsData = req.body;

        const dto = new createAppSettingsDto(appSettingsData);

        const newAppSettings = await AppSettingService.createAppSettings(dto);

        const response = new ResponseAppSettingsDto(newAppSettings);

        return res.status(201).json(response);
    },
};