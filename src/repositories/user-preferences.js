import { UserPreferences } from "../models/user-preferences.js"

export const UserPreferencesRepository = {
    getByUserId: async (id) => {
        const selectIdQuery = `SELECT * FROM user_preferences WHERE user_id = $1`;
        
        const result = await db.query(selectIdQuery, [id]);

        if(!result){
            return null;
        }

        return new UserPreferences(result.rows[0]);
    },

    create: async (userPreferences) => {
        const insertIdQuery = 
        `INSERT INTO user_preferences 
        (user_id, dnd_start_time, dnd_end_time, push_enabled, email_enabled, comuniq_enabled, push_sound_enabled) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
        RETURNING *
        `;

        const values = [
            userPreferences.userId,
            userPreferences.dndStartTime,
            userPreferences.dndEndTime,
            userPreferences.pushEnabled,
            userPreferences.emailEnabled,
            userPreferences.comuniqEnabled,
            userPreferences.pushSoundEnabled
        ]

        const result = await db.query(insertIdQuery, values);

        return new UserPreferences(result.rows[0]);
    },

    update: async (id, userPreferences) => {
        // Implementation to update existing user preferences in the database
    },

    delete: async (id) => {
        // Implementation to delete user preferences from the database
    }
};