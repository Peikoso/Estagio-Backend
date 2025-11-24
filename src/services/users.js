import { UsersRepository } from '../repositories/users.js';
import { Users } from '../models/users.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { isValidUuid } from '../utils/validations.js';
import { RoleService } from './roles.js';
import { register } from 'module';

export const UserService = {
    getAllUsers: async () => {
        const users = await UsersRepository.findAll();
        
        return users;
    },

    getUserById: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalide User UUID.')
        }

        const user = await UsersRepository.findById(id)

        if(!user){
            throw new NotFoundError('User not found.')
        }

        return user;
    },

    createUser: async (dto) => {
        const newUser = new Users(dto).activate();

        for(const roleId of newUser.roles){
            await RoleService.getRoleById(roleId);
        }

        const savedUser = await UsersRepository.create(newUser);

        return savedUser;
    },

    registerUser: async (dto) => {
        const newUser = new Users(dto).markAsPending();

        const savedUser = await UsersRepository.create(newUser);

        return savedUser;
    },

    adminUpdateUser: async (id, dto) => {
        const existingUser = await UserService.getUserById(id);

        for(const roleId of dto.roles){
            await RoleService.getRoleById(roleId);
        }

        const updatedUser = new Users({
            ...existingUser,
            ...dto,
            updatedAt: new Date(),
        });

        const savedUser = await UsersRepository.update(updatedUser);

        return savedUser;
    },

    userUpdateSelf: async (id, dto) => {
        const existingUser = await UserService.getUserById(id);

        const updatedUser = new Users({
            ...existingUser,
            ...dto,
            updatedAt: new Date(),
        });

        const savedUser = await UsersRepository.update(updatedUser);

        return savedUser;
    },

    deleteUser: async (id) => {
        await UserService.getUserById(id);

        await UsersRepository.delete(id);
    },

};