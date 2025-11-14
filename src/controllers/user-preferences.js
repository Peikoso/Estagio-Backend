import { CreateUserPreferencesDto } from "../dto/user_preferences/create-user-preferences-dto";
import { ResponseUserPreferencesDto } from "../dto/user_preferences/response-user-preferences-dto";
import { UserPreferenceService } from "../services/user-preferences.js";

export const UserPreferencesController = {
    getUserPreferences: async (req, res) => {
        const id = req.params.id;

        const userPreferences = await UserPreferenceService.getUserPreferences(id);

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
        const id = req.params.id;
        
        const preferencesData = req.body;

        const dto = new CreateUserPreferencesDto(preferencesData).validate();

        const updatedUserPreferences = await UserPreferenceService.updateUserPreferences(id, dto);

        const response = new ResponseUserPreferencesDto(updatedUserPreferences);

        return res.status(200).json(response);

    },

    deleteUserPreferences: async (req, res) => {
        const id = req.params.id;

        await UserPreferenceService.deleteUserPreferences(id);

        return res.status(204).send();
    },

};