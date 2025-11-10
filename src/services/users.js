import { UserRepository } from '../repositories/users.js'
import { ResponseUsersDto } from '../dto/users/responseUsersDto.js'
import { CreateUsersDto } from '../dto/users/createUsersDto.js'
import { Users } from '../models/users.js'
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { isValidUuid } from '../utils/valid_uuid.js'

export const UserService = {
    getAllUsers: async () => {
        const users = await UserRepository.findAll();
        return ResponseUsersDto.fromArray(users);
    },

    getUserById: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalide UUID.')
        }

        const user = UserRepository.findById(id)

        if(!user){
            throw new NotFoundError('User not found.')
        }

        return new ResponseUsersDto(user);
    },

    createUser: async (userData) => {
        const dto = new CreateUsersDto(userData).validate();

        new Users(dto).validateBusinessRules();

        const newUser = await UserRepository.create(dto);

        return new ResponseUsersDto(newUser);
    }
};