import express from 'express';
import { getExampleData, createExampleData } from '../../controllers/example.js';

const router = express.Router();

router.get('/data', getExampleData);
router.post('/data', createExampleData);

export default router;
