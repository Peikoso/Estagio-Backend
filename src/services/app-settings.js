import { ForbiddenError } from "../utils/errors";

export const AppSettingService = {
    getAppSettingsByKey: async (key) => {
        throw new ForbiddenError("Method not implemented");
    },

    createAppSettings: async (dto) => {
        throw new ForbiddenError("Method not implemented");
    },
};