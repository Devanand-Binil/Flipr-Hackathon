import express from 'express';
import {
  getMessagesByChannel,
  getMessageById,
  searchMessages,
  addReaction,
  removeReaction,
  updateMessage,
  deleteMessage,
  pinMessage,
  unpinMessage,
  getLinkPreview
} from '../controllers/message.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public or authorized access based on your design
router.get('/channel/:channelId', authMiddleware, getMessagesByChannel);
router.get('/channel/:channelId/search', authMiddleware, searchMessages);

router.get('/preview', authMiddleware, getLinkPreview);

router.get('/:messageId', authMiddleware, getMessageById);
router.put('/:messageId', authMiddleware, updateMessage);
router.delete('/:messageId', authMiddleware, deleteMessage);

router.post('/:messageId/reactions', authMiddleware, addReaction);
router.delete('/:messageId/reactions', authMiddleware, removeReaction);

router.post('/:messageId/pin', authMiddleware, pinMessage);
router.post('/:messageId/unpin', authMiddleware, unpinMessage);

export default router;
