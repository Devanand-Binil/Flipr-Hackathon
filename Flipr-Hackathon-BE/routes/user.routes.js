import express from 'express';
import {
  getLoggedInUserProfile,
  updateLoggedInUserProfile,
  getPublicUserProfile,
  uploadProfileAvatar,
  updateNotificationPreferences,
  updateThemePreference
} from '../controllers/user.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
//import uploadMiddleware from '../middlewares/upload.middleware.js'; // Multer or similar

const router = express.Router();

// Get logged-in user's profile
router.get('/me', authMiddleware, getLoggedInUserProfile);

// Update logged-in user's profile
router.put('/me', authMiddleware, updateLoggedInUserProfile);

// Upload profile avatar
//router.post('/me/avatar', authMiddleware, uploadMiddleware.single('avatar'), uploadProfileAvatar);

// Update notification preferences
router.put('/me/notifications', authMiddleware, updateNotificationPreferences);

// Update theme preference
router.put('/me/theme', authMiddleware, updateThemePreference);

// Get public user profile
router.get('/:userId', getPublicUserProfile); // No auth required for public profiles

export default router;
