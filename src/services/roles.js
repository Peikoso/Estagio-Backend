import { RolesRepository } from '../repositories/roles.js';
import { Roles } from '../models/roles.js';
import { isValidUuid } from '../utils/validations.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';


export const RoleService = {
    getAllRoles: async () => {
        const roles = await RolesRepository.findAll();
        
        return roles;
    },

    getRoleById: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid Role UUID.');
        }

        const role = await RolesRepository.findById(id);

        if(!role){
            throw new NotFoundError('Role not found.');
        }

        return role;
    },

    createRole: async (dto) => {
        const newRole = new Roles(dto);

        const savedRole = await RolesRepository.create(newRole);

        return savedRole;
    },

    updateRole: async (id, dto) => {
        const existingRole = await RoleService.getRoleById(id);

        const updatedRole = new Roles({
            ...existingRole,
            ...dto,
            updatedAt: new Date()
        });

        const savedRole = await RolesRepository.update(updatedRole);

        return savedRole;
    },

    deleteRole: async (id) => {
        await RoleService.getRoleById(id);
        
        await RolesRepository.delete(id);
    }
};