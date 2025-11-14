import { UserPreferences } from "../models/user-preferences.js"
import { UserPreferencesRepository } from "../repositories/user-preferences.js"
import { ForbiddenError, NotFoundError, BusinessLogicError } from "../utils/errors.js";
import { UserService} from "./users.js";

export const UserPreferenceService = {
    getUserPreferences: async (id) => {
        const userPreference = await UserPreferencesRepository.getById(id);

        if (!userPreference) {
            throw new NotFoundError('User preference not found');
        }
        
        return new UserPreferences(userPreference);
    },

    createUserPreference: async (dto) => {
        const newUserPreference = new UserPreferences(dto).validateBusinessLogic();

        await UserService.getUserById(newUserPreference.userId);

        const existingPreference = await UserPreferencesRepository.getByUserId(newUserPreference.userId);   
        if (existingPreference) {
            throw new BusinessLogicError('User preference already exists for this user');
        }

        const savedUserPreference = await UserPreferencesRepository.create(newUserPreference);

        return savedUserPreference;
    },

    updateUserPreferences: async (id, userPreference) => {
        throw new ForbiddenError("Not implemented.");
    },

    deleteUserPreferences: async (id) => {
        throw new ForbiddenError("Not implemented.");
    },
    
};