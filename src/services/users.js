import { UsersRepository } from '../repositories/users.js';
import { Users } from '../models/users.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { isValidUuid } from '../utils/validations.js';
import { RoleService } from './roles.js';
import { AuthService } from './auth.js'

export const UserService = {
    getAllUsers: async (currentUserFirebaseUid) => {
        await AuthService.requireAdmin(currentUserFirebaseUid);

        const users = await UsersRepository.findAll();
        
        return users;
    },

    getSelf: async (currentUserFirebaseUid) => {
        const user = await UsersRepository.findByFirebaseId(currentUserFirebaseUid);

        if(!user){
            throw new NotFoundError('User not found.');
        }

        return user;
    },

    getUserById: async (id, currentUserFirebaseUid) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid User UUID.');
        }

        await AuthService.requireAdmin(currentUserFirebaseUid);

        const user = await UsersRepository.findById(id);

        if(!user){
            throw new NotFoundError('User not found.');
        }

        return user;
    },

    createUser: async (dto, currentUserFirebaseUid) => {
        await AuthService.requireAdmin(currentUserFirebaseUid)

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

    adminUpdateUser: async (id, dto, currentUserFirebaseUid) => {
        const existingUser = await UserService.getUserById(id, currentUserFirebaseUid);

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

    userUpdateSelf: async (dto, currentUserFirebaseUid) => {
        const existingUser = await UserService.getSelf(currentUserFirebaseUid);

        const updatedUser = new Users({
            ...existingUser,
            ...dto,
            updatedAt: new Date(),
        });

        const savedUser = await UsersRepository.update(updatedUser);

        return savedUser;
    },

    deleteUser: async (id, currentUserFirebaseUid) => {
        await UserService.getUserById(id, currentUserFirebaseUid);

        await UsersRepository.delete(id);
    },

};