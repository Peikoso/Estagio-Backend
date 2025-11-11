import { IncidentsController } from '../controllers/incidents.js';
import express from 'express';

const router = express.Router();

router.get('/', IncidentsController.getAllIncidents);
router.get('/:id', IncidentsController.getIncidentById);
router.post('/', IncidentsController.createIncident)

router.get('/logs/:id', IncidentsController.getIncidentLogsByIncidentId);
router.post('/logs', IncidentsController.createIncidentsAction);

export default router;