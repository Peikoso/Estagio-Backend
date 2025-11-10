import { CreateRolesDto } from '../dto/roles/createRolesDto.js';
import { ResponseRolesDto } from '../dto/roles/responseRolesDto.js';
import { RoleRepository } from '../repositories/roles.js';
import { Roles } from '../models/roles.js';

export const RoleService = {
    getAllRoles: async () => {
        const roles = await RoleRepository.findAll();
        return ResponseRolesDto.fromArray(roles);
    },

    createRole: async (roleData) => {
        const dto = new CreateRolesDto(roleData).validate();
        
        new Roles(dto).validateBusinessRules();

        const newRole = await RoleRepository.create(dto);

        return new ResponseRolesDto(newRole);
    }
};