import express from 'express';
import { UserPreferencesController } from '../controllers/user-preferences.js';

const router = express.Router();

router.get('/:userId', UserPreferencesController.getUserPreferences);
router.post('/', UserPreferencesController.createUserPreferences);
router.put('/', UserPreferencesController.updateUserPreferences);
router.delete('/:userId', UserPreferencesController.deleteUserPreferences);

export default router;