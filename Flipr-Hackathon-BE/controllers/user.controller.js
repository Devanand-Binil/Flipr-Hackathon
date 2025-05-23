// backend/src/controllers/userController.js
import userService from '../services/user.service.js';
import uploadService from '../services/upload.service.js'; // For avatar upload
import { validateProfileUpdate } from '../utils/validation.js';

export const getLoggedInUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // User ID from JWT payload attached by authMiddleware
        const user = await userService.getUserProfileById(userId);
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

export const updateLoggedInUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // User ID from JWT payload
        const updates = req.body;

        validateProfileUpdate(updates); // Validate incoming update fields

        const updatedUser = await userService.updateUserProfileById(userId, updates);
        res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        next(error);
    }
};

export const getPublicUserProfile = async (req, res, next) => {
    try {
        const { userId } = req.params; // User ID from URL parameter
        const user = await userService.getUserProfileById(userId, true); // True to indicate public view (might exclude sensitive fields)
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

export const uploadProfileAvatar = async (req, res, next) => {
    try {
        const userId = req.user.id; // User ID from JWT payload
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Assuming uploadService handles the actual storage to Cloudinary/S3
        const { url, public_id } = await uploadService.uploadFile(req.file, { folder: 'profile_avatars', userId: userId });

        // Update user's profile picture URL in DB
        const updatedUser = await userService.updateUserProfileById(userId, { profilePicture: url });

        res.status(200).json({ success: true, message: 'Avatar uploaded successfully', avatarUrl: url, public_id: public_id });
    } catch (error) {
        next(error);
    }
};

export const updateNotificationPreferences = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { notifications } = req.body; // Expecting { emailEnabled: true, realtimeEnabled: false, etc. }

        const updatedUser = await userService.updateNotificationPreferences(userId, notifications);
        res.status(200).json({ success: true, message: 'Notification preferences updated', notifications: updatedUser.notifications });
    } catch (error) {
        next(error);
    }
};

export const updateThemePreference = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { themePreference } = req.body; // Expecting 'light' or 'dark'

        const updatedUser = await userService.updateThemePreference(userId, themePreference);
        res.status(200).json({ success: true, message: 'Theme preference updated', themePreference: updatedUser.themePreference });
    } catch (error) {
        next(error);
    }
};