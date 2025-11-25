import express from 'express';
import { RunnersController, RunnerLogsController, RunnerQueueController } from '../controllers/runners.js';

const router = express.Router();

router.get('/', RunnersController.getAllRunners);
router.post('/', RunnersController.createRunner);
router.put('/:id', RunnersController.updateRunner);
router.delete('/:id', RunnersController.deleteRunner);

router.get('/queue', RunnerQueueController.getAllRunnerQueue);
router.post('/queue', RunnerQueueController.createRunnerQueue);
router.put('/queue/:id', RunnerQueueController.updateRunnerQueue);
router.delete('/queue/:id', RunnerQueueController.deleteRunnerQueue);

router.get('/logs', RunnerLogsController.getAllRunnersLogs);
router.get('/logs/:runnerId', RunnerLogsController.getRunnerLogsByRunnerId);
router.post('/logs', RunnerLogsController.createRunnerLog);

export default router;