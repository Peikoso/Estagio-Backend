import express  from 'express';

import rulesRouter from './rules.js';
import usersRouter from './users.js';
import rolesRouter from './roles.js';
import incidentsRouter from './incidents.js'
import schedulesRouter from './schedules.js';
import escalationPoliciesRouter from './escalation-policies.js';
import runnersRouter from './runners.js';

const router = express.Router();

router.use('/rules', rulesRouter);
router.use('/users', usersRouter);
router.use('/roles', rolesRouter);
router.use('/incidents', incidentsRouter);
router.use('/schedules', schedulesRouter);
router.use('/escalation-policies', escalationPoliciesRouter);
router.use('/runners', runnersRouter);

export default router;
