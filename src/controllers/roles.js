import { RoleService } from '../services/roles.js'
import { CreateRolesDto } from '../dto/roles/create-roles-dto.js';
import { ResponseRolesDto } from '../dto/roles/response-roles-dto.js';


export const RolesController = {
    getAllRoles: async (req, res) => {
        try {
            const roles = await RoleService.getAllRoles();

            const response = ResponseRolesDto.fromArray(roles);

            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json( {error: 'Internal Server Error.' });
        }
    },

    createRole: async (req, res) => {
        try {
            const roleData = req.body;

            const dto = new CreateRolesDto(roleData).validate();

            const newRole = await RoleService.createRole(dto);

            const response = new ResponseRolesDto(newRole);

            return res.status(201).json(response);
        } catch (error) {
            if(error.name === 'ValidationError'){
                return res.status(422).json({error: error.message});
            }
            console.error(error)
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
}