// backend/src/services/authService.js
import User from '../models/User.js';
// Removed direct import of bcrypt and jwt as these are handled by utils/jwt.js and User model pre-hook
import crypto from 'crypto';
import { sendEmail } from '../utils/emailUtil.js';
import { CustomError } from '../utils/CustomError.js';
import { generateAuthToken, generateRefreshToken } from '../utils/jwt.js'; // Import new jwt utils

const authService = {
    async registerUser({ username, email, password }) {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            if (userExists.email === email) {
                throw new CustomError('User with that email already exists', 400);
            }
            if (userExists.username === username) {
                throw new CustomError('User with that username already exists', 400);
            }
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            const accessToken = generateAuthToken(user._id);
            const { token: rawRefreshToken, hashedToken, expiresAt: refreshTokenExpiresAt } = generateRefreshToken(user._id);

            // Store hashed refresh token in user document
            user.refreshTokens.push({ token: hashedToken, expiresAt: refreshTokenExpiresAt });
            await user.save({ validateBeforeSave: false });

            return { user, accessToken, refreshToken: rawRefreshToken }; // Return raw refresh token to client
        } else {
            throw new CustomError('Invalid user data', 400);
        }
    },

    async loginUser({ email, password }) {
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            throw new CustomError('Invalid credentials (email or password incorrect)', 401);
        }

        const accessToken = generateAuthToken(user._id);
        const { token: rawRefreshToken, hashedToken, expiresAt: refreshTokenExpiresAt } = generateRefreshToken(user._id);

        // Add new refresh token to user's array
        // Optional: Implement a limit to how many refresh tokens a user can have (e.g., delete oldest if > 5)
        user.refreshTokens.push({ token: hashedToken, expiresAt: refreshTokenExpiresAt });
        user.isOnline = true;
        user.lastOnline = Date.now();
        await user.save({ validateBeforeSave: false });

        return { user, accessToken, refreshToken: rawRefreshToken };
    },

    async logoutUser(rawRefreshToken) {
        if (!rawRefreshToken) {
            throw new CustomError('Refresh token is required for logout.', 400);
        }

        const hashedToken = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

        const user = await User.findOne({ 'refreshTokens.token': hashedToken });

        if (!user) {
            // If token not found, it's either already revoked or invalid, proceed as success to prevent enumeration
            console.log('Attempted logout with unknown or already revoked refresh token.');
            return { message: 'Logged out successfully.' };
        }

        // Filter out the specific refresh token
        user.refreshTokens = user.refreshTokens.filter(
            rt => rt.token !== hashedToken
        );

        // Optionally, set user offline if this was their last active session
        if (user.refreshTokens.length === 0) {
            user.isOnline = false;
        }

        await user.save({ validateBeforeSave: false }); // No re-validation needed
        return { message: 'Logged out successfully.' };
    },

    async refreshAccessToken(rawRefreshToken) {
        if (!rawRefreshToken) {
            throw new CustomError('Refresh token is required for refreshing access token.', 400);
        }

        const hashedToken = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

        // Find user and specific refresh token
        const user = await User.findOne({
            'refreshTokens.token': hashedToken,
            'refreshTokens.expiresAt': { $gt: Date.now() } // Token must not be expired
        });

        if (!user) {
            throw new CustomError('Invalid or expired refresh token. Please log in again.', 401);
        }

        // Option 1: Refresh Token Rotation (Recommended for security)
        // Invalidate the old refresh token and generate a new one
        user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== hashedToken); // Remove old token

        const newAccessToken = generateAuthToken(user._id);
        const { token: newRawRefreshToken, hashedToken: newHashedRefreshToken, expiresAt: newRefreshTokenExpiresAt } = generateRefreshToken(user._id);

        user.refreshTokens.push({ token: newHashedRefreshToken, expiresAt: newRefreshTokenExpiresAt }); // Add new token

        await user.save({ validateBeforeSave: false });

        return { accessToken: newAccessToken, refreshToken: newRawRefreshToken };

        /*
        // Option 2: Keep the existing refresh token
        // (Simpler, but less secure as a stolen refresh token can be used repeatedly)
        // const newAccessToken = generateAuthToken(user._id);
        // return { accessToken: newAccessToken, refreshToken: rawRefreshToken };
        */
    },

    async initiatePasswordRecovery(email) {
        const user = await User.findOne({ email });

        if (!user) {
            // Send generic success to prevent email enumeration
            console.log(`Password reset requested for non-existent email: ${email}`);
            return; // Don't throw error
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token and expiry on user model
        user.resetPasswordToken = passwordResetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save({ validateBeforeSave: false }); // Don't re-validate other fields

        // Create reset URL for frontend
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}. If you did not request this, please ignore this email.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message: message,
            });
            console.log('Password reset email sent to:', user.email);
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });
            throw new CustomError('There was an error sending the password reset email. Please try again later.', 500);
        }
    },

    async resetPassword(token, newPassword) {
        // Hash the incoming token to compare with the one in DB
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() }, // Token must not be expired
        });

        if (!user) {
            throw new CustomError('Password reset token is invalid or has expired.', 400);
        }

        user.password = newPassword; // Hashing handled by pre-save hook
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save(); // This will trigger the pre-save hook to hash the new password

        return user;
    },

    // --- Bonus Features (Optional) ---
    async sendTwoFactorAuthCode(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('User not found', 404);
        }

        // Generate a random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // In a real app, store this code in user's model or a temporary collection with expiry
        // user.twoFactorAuthCode = code;
        // user.twoFactorAuthCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        // await user.save({ validateBeforeSave: false });

        // Send the code via email
        const message = `Your 2FA code is: ${code}. This code is valid for 10 minutes.`;
        await sendEmail({
            email: user.email,
            subject: 'Your Two-Factor Authentication Code',
            message: message,
        });

        return { message: '2FA code sent.' };
    },

    async verifyTwoFactorAuthCode(userId, code) {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('User not found', 404);
        }

        // In a real app, compare the received code with the stored one and check expiry
        // if (user.twoFactorAuthCode === code && user.twoFactorAuthCodeExpires > Date.now()) {
        //     user.twoFactorAuthCode = undefined;
        //     user.twoFactorAuthCodeExpires = undefined;
        //     await user.save({ validateBeforeSave: false });
        //     const token = generateToken(user._id);
        //     return { user, token };
        // } else {
        //     throw new CustomError('Invalid or expired 2FA code.', 400);
        // }
        // Placeholder for now
        const token = generateToken(user._id);
        return { user, token };
    },

    // ... (forgotPassword, resetPassword, sendTwoFactorAuthCode, verifyTwoFactorAuthCode remain the same) ...
};

export default authService;