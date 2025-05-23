import express from 'express';
import { uploadFile } from '../controllers/upload.controller.js'; // Assuming you have a controller for handling file uploads
import authMiddleware from '../middlewares/auth.middleware.js';
//import uploadMiddleware from '../middlewares/upload.middleware.js'; // Multer or similar

const router = express.Router();

// Upload any file (authenticated)
//router.post('/', authMiddleware, uploadMiddleware.single('file'), uploadFile);

export default router;
