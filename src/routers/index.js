import express  from 'express';

import rulesRouter from './rules.js';
import usersRouter from './users.js';

const router = express.Router();

router.use('/rules', rulesRouter);
router.use('/users', usersRouter);

export default router;
