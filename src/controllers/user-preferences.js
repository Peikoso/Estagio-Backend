import { CreateUserPreferencesDto } from "../dto/user_preferences/create-user-preferences-dto.js";
import { ResponseUserPreferencesDto } from "../dto/user_preferences/response-user-preferences-dto.js";
import { UserPreferenceService } from "../services/user-preferences.js";

export const UserPreferencesController = {
    getUserPreferences: async (req, res) => {
        const userId = req.params.userId;

        const userPreferences = await UserPreferenceService.getUserPreferences(userId);

        const response = new ResponseUserPreferencesDto(userPreferences);

        return res.status(200).json(response);
    },

    createUserPreferences: async (req, res) => {
        const preferencesData = req.body;

        const dto = new CreateUserPreferencesDto(preferencesData).validate();
        
        const newUserPreferences = await UserPreferenceService.createUserPreference(dto);

        const response = new ResponseUserPreferencesDto(newUserPreferences);

        return res.status(201).json(response);
    },

    updateUserPreferences: async (req, res) => {
        const preferencesData = req.body;

        const dto = new CreateUserPreferencesDto(preferencesData).validate();

        const updatedUserPreferences = await UserPreferenceService.updateUserPreferences(dto);

        const response = new ResponseUserPreferencesDto(updatedUserPreferences);

        return res.status(200).json(response);

    },

    deleteUserPreferences: async (req, res) => {
        const userId = req.params.userId;

        await UserPreferenceService.deleteUserPreferences(userId);

        return res.status(204).send();
    },

};