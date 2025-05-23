// backend/src/controllers/authController.js
import authService from '../services/auth.service.js';
import { validateRegistration, validateLogin, validateEmail, validatePasswordReset } from '../utils/validation.js';

// Helper function for sending consistent success responses with JWT
const sendAuthResponse = (res, user, accessToken, refreshToken, message = 'Success') => { // Added refreshToken parameter
    // Best practice: Send refresh token as an HttpOnly cookie
    res.cookie('jwtRefresh', refreshToken, {
        httpOnly: true, // Not accessible via client-side JavaScript
        secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
        sameSite: 'Strict', // Protects against CSRF attacks
        expires: new Date(Date.now() + parseFloat(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_MS)) // Match token expiry
    });

    res.status(200).json({
        success: true,
        message,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            isOnline: user.isOnline,
            notifications: user.notifications,
            themePreference: user.themePreference
        },
        accessToken, // Access token can be sent in response body or another header for client-side use
    });
};

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        validateRegistration({ username, email, password });

        const { user, accessToken, refreshToken } = await authService.registerUser({ username, email, password });
        sendAuthResponse(res, user, accessToken, refreshToken, 'User registered successfully');
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        validateLogin({ email, password });

        const { user, accessToken, refreshToken } = await authService.loginUser({ email, password });
        sendAuthResponse(res, user, accessToken, refreshToken, 'Logged in successfully');
    } catch (error) {
        next(error);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        // Get refresh token from HttpOnly cookie
        const refreshToken = req.cookies.jwtRefresh;
        if (!refreshToken) {
            return res.status(200).json({ success: true, message: 'Already logged out or no session active.' });
        }

        await authService.logoutUser(refreshToken);

        // Clear the HttpOnly cookie on client
        res.clearCookie('jwtRefresh', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } catch (error) {
        next(error);
    }
};

// NEW: Endpoint to refresh access token
export const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.jwtRefresh; // Get refresh token from HttpOnly cookie

        if (!refreshToken) {
            throw new CustomError('No refresh token provided. Please log in.', 401);
        }

        const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(refreshToken);

        // Send new refresh token as HttpOnly cookie
        res.cookie('jwtRefresh', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            expires: new Date(Date.now() + parseFloat(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_MS))
        });

        res.status(200).json({
            success: true,
            message: 'Access token refreshed successfully.',
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        validateEmail(email); // Validate email format

        await authService.initiatePasswordRecovery(email);
        // Always send a generic success message to prevent email enumeration
        res.status(200).json({ success: true, message: 'If a matching account is found, a password reset email has been sent.' });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        validatePasswordReset(newPassword); // Validate new password strength

        await authService.resetPassword(token, newPassword);
        res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
    } catch (error) {
        next(error);
    }
};

// --- Bonus Features (Optional) ---

export const sendTwoFactorAuthCode = async (req, res, next) => {
    try {
        // Assuming user is authenticated via JWT but needs 2FA for sensitive actions
        // or during initial login if 2FA is enabled.
        const userId = req.user.id; // User ID from authenticated JWT
        await authService.sendTwoFactorAuthCode(userId);
        res.status(200).json({ success: true, message: '2FA code sent.' });
    } catch (error) {
        next(error);
    }
};

export const verifyTwoFactorAuthCode = async (req, res, next) => {
    try {
        const { userId, code } = req.body; // userId might come from a temporary token if 2FA is post-login
        const { user, token } = await authService.verifyTwoFactorAuthCode(userId, code);
        sendAuthResponse(res, user, token, '2FA verified. Logged in successfully.');
    } catch (error) {
        next(error);
    }
};

// ... (forgotPassword, resetPassword, sendTwoFactorAuthCode, verifyTwoFactorAuthCode remain the same) ...