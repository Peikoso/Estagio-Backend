import express from 'express';
import { SQLTestsController } from '../controllers/sql_test.js';

const router = express.Router();

router.get('/', SQLTestsController.getAllSQLTests);
router.post('/', SQLTestsController.createSQLTest);
router.put('/:id', SQLTestsController.updateSQLTest);
router.delete('/:id', SQLTestsController.deleteSQLTest);

export default router;