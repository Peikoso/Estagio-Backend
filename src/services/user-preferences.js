import { UserPreferences } from "../models/user-preferences.js"
import { UserPreferencesRepository } from "../repositories/user-preferences.js"
import { ValidationError, NotFoundError, BusinessLogicError } from "../utils/errors.js";
import { UserService} from "./users.js";
import { ChannelService } from "./channels.js"; 
import { isValidUuid } from "../utils/validations.js";

export const UserPreferenceService = {
    getUserPreferences: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid UUID format for user ID');
        }

        const userPreference = await UserPreferencesRepository.getByUserId(id);

        if (!userPreference) {
            throw new NotFoundError('User preference not found');
        }
        
        return userPreference;
    },

    createUserPreference: async (dto) => {
        const newUserPreference = new UserPreferences(dto);

        await UserService.getUserById(newUserPreference.userId);

        const existingPreference = await UserPreferencesRepository.getByUserId(newUserPreference.userId);   
        if (existingPreference) {
            throw new BusinessLogicError('User preference already exists for this user');
        }

        for (const channelId of newUserPreference.channels) {
            await ChannelService.getChannelById(channelId);
        }

        const savedUserPreference = await UserPreferencesRepository.create(newUserPreference);

        return savedUserPreference;
    },

    updateUserPreferences: async (dto) => {
        const existingPreference = await UserPreferenceService.getUserPreferences(dto.userId);

        for (const channelId of dto.channels) {
            await ChannelService.getChannelById(channelId);
        }

        const updatedUserPreferences = new UserPreferences({
            ...existingPreference,
            ...dto,
            updatedAt: new Date(),
        });

        const savedUserPreferences = await UserPreferencesRepository.update(updatedUserPreferences);

        return savedUserPreferences;
    },

    deleteUserPreferences: async (userId) => {
        await UserPreferenceService.getUserPreferences(userId);

        await UserPreferencesRepository.delete(userId);
    },
    
};