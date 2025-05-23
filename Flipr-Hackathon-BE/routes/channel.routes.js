import express from 'express';
import {
  createChannel,
  getUserChannels,
  getChannelDetails,
  updateChannel,
  leaveChannel,
  removeParticipant,
  addParticipant,
  updateChannelPicture,
  promoteToAdmin,
  demoteFromAdmin
} from '../controllers/channel.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
//import multer from 'multer';

const router = express.Router();
//const upload = multer({ dest: 'uploads/' }); // Temporary path; handled by uploadService

// Channel core operations
router.post('/', authMiddleware, createChannel);
router.get('/', authMiddleware, getUserChannels);
router.get('/:channelId', authMiddleware, getChannelDetails);
router.put('/:channelId', authMiddleware, updateChannel);

// Participants
router.post('/:channelId/participants', authMiddleware, addParticipant);
router.delete('/:channelId/participants/:participantId', authMiddleware, removeParticipant);
router.post('/:channelId/leave', authMiddleware, leaveChannel);

// Admin actions
router.post('/:channelId/promote/:userIdToPromote', authMiddleware, promoteToAdmin);
router.post('/:channelId/demote/:userIdToDemote', authMiddleware, demoteFromAdmin);

// Channel picture update
//router.post('/:channelId/picture', authMiddleware, upload.single('picture'), updateChannelPicture);

export default router;
