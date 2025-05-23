// backend/src/utils/jwt.js
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // For generating random strings for refresh token
import  CustomError  from './CustomError.js';

export const generateAuthToken = (userId) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_ACCESS_TOKEN_EXPIRES_IN) { // Changed env var name
        throw new Error('JWT_SECRET and JWT_ACCESS_TOKEN_EXPIRES_IN must be defined in environment variables.');
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
};

export const generateRefreshToken = (userId) => {
    if (!process.env.JWT_REFRESH_TOKEN_EXPIRES_IN) { // New env var name
        throw new Error('JWT_REFRESH_TOKEN_EXPIRES_IN must be defined in environment variables.');
    }

    const token = crypto.randomBytes(64).toString('hex'); // Generate a long random string
    const expiresAt = new Date(Date.now() + parseFloat(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_MS)); // Convert to milliseconds

    return {
        token, // The raw, random refresh token
        hashedToken: crypto.createHash('sha256').update(token).digest('hex'), // Hashed version for DB storage
        expiresAt // When this refresh token expires
    };
};

export const verifyAuthToken = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be defined in environment variables.');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new CustomError('Access token has expired', 401); // More specific error
        }
        if (error.name === 'JsonWebTokenError') {
            throw new CustomError('Invalid access token', 401); // More specific error
        }
        throw new CustomError('Authentication failed', 401);
    }
};

// New function to verify a refresh token from the database
export const verifyRefreshToken = async (rawRefreshToken) => {
    const hashedToken = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    // Find a user with this hashed refresh token and check if it's expired
    const user = await User.findOne({
        'refreshTokens.token': hashedToken,
        'refreshTokens.expiresAt': { $gt: Date.now() } // Must not be expired
    });

    if (!user) {
        throw new CustomError('Invalid or expired refresh token.', 401);
    }

    // Find the specific refresh token in the user's array
    const refreshTokenInDb = user.refreshTokens.find(rt => rt.token === hashedToken);

    if (!refreshTokenInDb) { // Should technically be caught by the findOne above, but as a safeguard
        throw new CustomError('Invalid or expired refresh token.', 401);
    }

    return { user, refreshTokenInDb };
};