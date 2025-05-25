// routes/mainRouter.js
// ===========================================
//            Centralized Main Router
// ===========================================

import express from 'express';
import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import conversationRoutes from './conversation.route.js';
import messageRoutes from './message.route.js';

const router = express.Router();

// ========== Sub-Routes ========== //
router.use('/auth', authRoutes);               // → /api/v1/auth/...
router.use('/user', userRoutes);               // → /api/v1/user/...
router.use('/conversation', conversationRoutes); // → /api/v1/conversation/...
router.use('/message', messageRoutes);         // → /api/v1/message/...

export default router;
