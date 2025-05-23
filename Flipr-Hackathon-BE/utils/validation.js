// backend/src/utils/validation.js
import CustomError from '../utils/CustomError.js'; // Adjust the import path as necessary
import validator from 'validator'; // You'll need to install 'validator': npm install validator

// --- User Authentication & Profile Validation ---

export const validateRegistration = ({ username, email, password }) => {
    if (!username || !email || !password) {
        throw new CustomError('Username, email, and password are required for registration.', 400);
    }
    if (!validator.isEmail(email)) {
        throw new CustomError('Invalid email format.', 400);
    }
    if (password.length < 6) {
        throw new new CustomError('Password must be at least 6 characters long.', 400);
    }
    if (username.length < 3) {
        throw new CustomError('Username must be at least 3 characters long.', 400);
    }
};

export const validateLogin = ({ email, password }) => {
    if (!email || !password) {
        throw new CustomError('Email and password are required for login.', 400);
    }
    // No email format validation here, as user might log in with username too (if supported by service)
};

export const validateEmail = (email) => {
    if (!email || !validator.isEmail(email)) {
        throw new CustomError('A valid email address is required.', 400);
    }
};

export const validatePasswordReset = (newPassword) => {
    if (!newPassword || newPassword.length < 6) {
        throw new CustomError('New password must be at least 6 characters long.', 400);
    }
};

export const validateProfileUpdate = (updates) => {
    if (Object.keys(updates).length === 0) {
        throw new CustomError('No update data provided.', 400);
    }
    if (updates.email && !validator.isEmail(updates.email)) {
        throw new CustomError('Invalid email format for profile update.', 400);
    }
    if (updates.username && updates.username.length < 3) {
        throw new CustomError('Username must be at least 3 characters long.', 400);
    }
    if (updates.themePreference && !['light', 'dark'].includes(updates.themePreference)) {
        throw new CustomError('Invalid theme preference. Must be "light" or "dark".', 400);
    }
    // Add more validation for other fields as needed
};

// --- Channel Validation ---

export const validateChannelCreation = ({ name, type, participants }) => {
    if (!type || !['private', 'group'].includes(type)) {
        throw new CustomError('Invalid channel type. Must be "private" or "group".', 400);
    }
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
        throw new CustomError('Channel must have participants.', 400);
    }
    if (type === 'group' && (!name || name.trim() === '')) {
        throw new CustomError('Group channel must have a name.', 400);
    }
    if (type === 'private' && participants.length !== 2) {
        throw new CustomError('Private channel must have exactly two participants.', 400);
    }
    // Basic ObjectId check for participants
    if (!participants.every(id => validator.isMongoId(id.toString()))) {
        throw new CustomError('Invalid participant ID(s).', 400);
    }
};

export const validateChannelUpdate = (updates) => {
    if (Object.keys(updates).length === 0) {
        throw new CustomError('No update data provided for channel.', 400);
    }
    if (updates.name && updates.name.trim() === '') {
        throw new CustomError('Channel name cannot be empty.', 400);
    }
    if (updates.name && updates.name.length > 50) {
        throw new CustomError('Channel name cannot exceed 50 characters.', 400);
    }
    if (updates.description && updates.description.length > 200) {
        throw new CustomError('Channel description cannot exceed 200 characters.', 400);
    }
};

// --- Message Validation ---

export const validateMessageReaction = ({ emoji }) => {
    if (!emoji || emoji.trim() === '') {
        throw new CustomError('Emoji is required for reaction.', 400);
    }
    // You could add a list of allowed emojis here for stricter validation
};

export const validateMessageEdit = ({ newContent }) => {
    if (!newContent || newContent.trim() === '') {
        throw new CustomError('Message content cannot be empty.', 400);
    }
    if (newContent.length > 2000) {
        throw new CustomError('Message content cannot exceed 2000 characters.', 400);
    }
};