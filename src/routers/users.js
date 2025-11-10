import { UsersController } from '../controllers/users.js';
import express from 'express';

const router = express.Router();

router.get('/', UsersController.getAllUsers);
router.get('/:id', UsersController.getUserById)
router.post('/', UsersController.createUser);

export default router;
