import express from 'express';
import { RunnersController } from '../controllers/runners.js';

const router = express.Router();

router.get('/', RunnersController.getAllRunners);

export default router;