import { UserService } from "../services/users.js";
import { CreateUsersDto, RegisterUsersDto } from "../dto/users/create-users-dto.js";
import { AdminUpdateUsersDto, UpdateUsersDto } from "../dto/users/update-users-dto.js";
import { ResponseUsersDto } from "../dto/users/response-users-dto.js";

export const UsersController = {
    getAllUsers: async  (req, res) => {
        const users = await UserService.getAllUsers();

        const response = ResponseUsersDto.fromArray(users);

        return res.status(200).json(response);
    },

    getUserById: async (req, res) => {
        const id = req.params.id;
        
        const user = await UserService.getUserById(id);

        const response = new ResponseUsersDto(user);

        return res.status(200).json(response);
    },

    createUser: async (req, res) => {
        const userData = req.body;

        const dto = new CreateUsersDto(userData).validate();

        const newUser = await UserService.createUser(dto);

        const response = new ResponseUsersDto(newUser);
        
        return res.status(201).json(response);
    },

    registerUser: async (req, res) => {
        const userData = req.body;

        const dto = new RegisterUsersDto(userData).validate();

        const newUser = await UserService.registerUser(dto);

        const response = new ResponseUsersDto(newUser);
        
        return res.status(201).json(response);
    },

    adminUpdateUser: async (req, res) => {
        const id = req.params.id;
        const userData = req.body;

        const dto = new AdminUpdateUsersDto(userData).validate();

        const updatedUser = await UserService.adminUpdateUser(id, dto);

        const response = new ResponseUsersDto(updatedUser);

        return res.status(200).json(response);
    },

    userUpdateSelf: async (req, res) => {
        const id = req.user.id;
        const userData = req.body;

        const dto = new UpdateUsersDto(userData).validate();

        const updatedUser = await UserService.userUpdateSelf(id, dto);

        const response = new ResponseUsersDto(updatedUser);

        return res.status(200).json(response);
    },

    deleteUser: async (req, res) => {
        const id = req.params.id;

        await UserService.deleteUser(id);

        return res.status(204).send();
    }
}