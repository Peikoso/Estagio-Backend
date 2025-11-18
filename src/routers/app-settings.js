import express from 'express';
import { AppSettingsController } from '../controllers/app-settings';

const router = express.Router();

router.get('/:key', AppSettingsController.getAppSettingsByKey);
router.post('/', AppSettingsController.createAppSettings);

export default router;