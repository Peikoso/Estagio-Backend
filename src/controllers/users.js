import { UserService } from "../services/users.js";
import { CreateUsersDto } from "../dto/users/create-users-dto.js";
import { ResponseUsersDto } from "../dto/users/response-users-dto.js";

export const UsersController = {
    getAllUsers: async  (req, res) => {
        try{
            const users = await UserService.getAllUsers();

            const response = ResponseUsersDto.fromArray(users);

            return res.status(200).json(response);
        } catch (error){
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUserById: async (req, res) => {
        try{
            const id = req.params.id;
            
            const user = await UserService.getUserById(id);

            const response = new ResponseUsersDto(user);

            return res.status(200).json(response);
        } catch (error){
            if(error.name === 'NotFoundError'){
                return res.status(error.status).json({error: error.message})
            }
            if(error.name === 'ValidationError'){
                return res.status(error.status).json({error: error.message})
            }
            console.error(error)
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createUser: async (req, res) => {
        try{
            const userData = req.body;

            const dto = new CreateUsersDto(userData).validate();

            const newUser = await UserService.createUser(dto);

            const response = new ResponseUsersDto(newUser);
            
            return res.status(201).json(response);
        } catch (error){
            if (error.name === 'ValidationError') {
                return res.status(error.status).json({ error: error.message });
            }
            if(error.name === 'NotFoundError'){
                return res.status(error.status).json({ error: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
}