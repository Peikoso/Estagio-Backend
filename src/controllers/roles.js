import { RoleService } from '../services/roles.js'
import { CreateRolesDto } from '../dto/roles/create-roles-dto.js';
import { ResponseRolesDto } from '../dto/roles/response-roles-dto.js';


export const RolesController = {
    getAllRoles: async (req, res) => {
        const roles = await RoleService.getAllRoles();

        const response = ResponseRolesDto.fromArray(roles);

        return res.status(200).json(response);
    },

    createRole: async (req, res) => {
        const roleData = req.body;

        const dto = new CreateRolesDto(roleData).validate();

        const newRole = await RoleService.createRole(dto);

        const response = new ResponseRolesDto(newRole);

        return res.status(201).json(response);
    },

    updateRole: async (req, res) => {
        const id = req.params.id;
        const roleData = req.body;

        const dto = new CreateRolesDto(roleData).validate();

        const updatedRole = await RoleService.updateRole(id, dto);

        const response = new ResponseRolesDto(updatedRole);

        return res.status(200).json(response);
    },

    deleteRole: async (req, res) => {
        const id = req.params.id;

        await RoleService.deleteRole(id);

        return res.status(204).send();
    }
}