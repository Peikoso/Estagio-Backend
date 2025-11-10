import { UserService } from "../services/users.js";

export const UsersController = {
    getAllUsers: async  (req, res) => {
        try{
            const users = await UserService.getAllUsers();
            return res.status(200).json(users);
        } catch (error){
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUserById: async (req, res) => {
        try{
            const id = req.params.id;
            
            const user = await UserService.getUserById(id);
            return res.status(200).json(user);
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
            const newUser = await UserService.createUser(userData);
            return res.status(201).json(newUser)
        } catch (error){
            if (error.name === 'ValidationError') {
                return res.status(error.status).json({ error: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
}