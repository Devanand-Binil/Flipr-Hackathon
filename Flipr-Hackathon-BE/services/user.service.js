// services/userService.js
import User from '../models/User.js';
import CustomError from '../utils/CustomError.js';

const userService = {
    async getUserProfileById(userId, isPublic = false) {
        let user;
        if (isPublic) {
            user = await User.findById(userId).select('-password -email -notifications -resetPasswordToken -resetPasswordExpires -isOnline');
        } else {
            user = await User.findById(userId).select('-password'); // Exclude password for private view
        }

        if (!user) {
            throw new CustomError('User not found', 404);
        }
        return user;
    },

    async updateUserProfileById(userId, updates) {
        const user = await User.findById(userId);

        if (!user) {
            throw new CustomError('User not found', 404);
        }

        // Prevent direct modification of sensitive fields like password here
        if (updates.password) {
            throw new CustomError('Password cannot be updated directly via this route. Use /auth/reset-password.', 400);
        }
        // Prevent changing email/username if you want to handle these separately with verification
        if (updates.email && updates.email !== user.email) {
            throw new CustomError('Email update requires re-verification. Use a dedicated email update process.', 400);
        }
        if (updates.username && updates.username !== user.username) {
            throw new CustomError('Username update not allowed or requires specific flow.', 400);
        }


        Object.keys(updates).forEach(key => {
            if (user[key] !== undefined) { // Only update fields that exist in the schema
                user[key] = updates[key];
            }
        });

        await user.save(); // Mongoose handles which fields are modified
        return user.toObject({ getters: true, virtuals: false, transform: (doc, ret) => { delete ret.password; return ret; } }); // Exclude password from response
    },

    async updateNotificationPreferences(userId, notificationUpdates) {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('User not found', 404);
        }

        // Merge existing preferences with updates
        user.notifications = { ...user.notifications, ...notificationUpdates };

        await user.save();
        return user.toObject({ getters: true, virtuals: false, transform: (doc, ret) => { delete ret.password; return ret; } });
    },

    async updateThemePreference(userId, themePreference) {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('User not found', 404);
        }

        if (!['light', 'dark'].includes(themePreference)) {
            throw new CustomError('Invalid theme preference. Must be "light" or "dark".', 400);
        }

        user.themePreference = themePreference;
        await user.save();
        return user.toObject({ getters: true, virtuals: false, transform: (doc, ret) => { delete ret.password; return ret; } });
    }
};

export default userService;