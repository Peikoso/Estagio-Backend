import express from 'express';
import { UserPreferencesController } from '../controllers/user-preferences.js';

const router = express.Router();

router.get('/:id', UserPreferencesController.getUserPreferences);
router.post('/', UserPreferencesController.createUserPreferences);
router.put('/:id', UserPreferencesController.updateUserPreferences);
router.delete('/:id', UserPreferencesController.deleteUserPreferences);

export default router;