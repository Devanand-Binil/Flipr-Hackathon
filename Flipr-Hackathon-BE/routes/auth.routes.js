import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  sendTwoFactorAuthCode,
  verifyTwoFactorAuthCode
} from '../controllers/auth.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Authentication & Session
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser); // Requires auth to logout
router.post('/refresh-token', refreshAccessToken);

// Password Reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Two-Factor Authentication (2FA)
router.post('/2fa/send-code', authMiddleware, sendTwoFactorAuthCode);
router.post('/2fa/verify', verifyTwoFactorAuthCode);

export default router;
