import { RoleService } from '../services/roles.js'

export const RolesController = {
    getAllRoles: async (req, res) => {
        try {
            const roles = await RoleService.getAllRoles();
            return res.status(200).json(roles);
        } catch (error) {
            console.error(error);
            return res.status(500).json( {error: 'Internal Server Error.' });
        }
    },

    createRole: async (req, res) => {
        try {
            const roleData = req.body;
            const newRole = await RoleService.createRole(roleData);
            return res.status(201).json(newRole);
        } catch (error) {
            if(error.name === 'ValidationError'){
                return res.status(422).json({ error: error.message });
            }
            console.error(error)
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
}