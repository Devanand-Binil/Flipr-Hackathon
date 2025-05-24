// backend/src/controllers/channelController.js
import channelService from '../services/channel.service.js';
import uploadService from '../services/upload.service.js';
import { validateChannelCreation, validateChannelUpdate } from '../utils/validation.js';

export const createChannel = async (req, res, next) => {
    try {
        const currentUserId = req.user.id; // User creating the channel
        const { name, type, participants, description } = req.body;

        // Ensure current user is included in participants if creating a private/group chat
        const finalParticipants = [...new Set([...participants, currentUserId])];
        console.log('Final Participants:', finalParticipants);

        // Validate channel creation data
        validateChannelCreation({ name, type, participants: finalParticipants });
        
        const newChannel = await channelService.createChannel({
            name,
            type,
            participants: finalParticipants,
            admin: type === 'group' ? currentUserId : undefined, // Creator is admin by default for groups
            description
        });

        res.status(201).json({ success: true, message: 'Channel created successfully', channel: newChannel });
    } catch (error) {
        next(error);
    }
};

export const getUserChannels = async (req, res, next) => {
    try {
        const userId = req.user.id; // User ID from JWT payload
        const channels = await channelService.getChannelsForUser(userId);
        res.status(200).json({ success: true, channels });
    } catch (error) {
        next(error);
    }
};

export const getChannelDetails = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const currentUserId = req.user.id; // Ensure user is a participant

        const channel = await channelService.getChannelById(channelId, currentUserId);
        res.status(200).json({ success: true, channel });
    } catch (error) {
        next(error);
    }
};

export const updateChannel = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const currentUserId = req.user.id;
        const updates = req.body; // e.g., { name: 'New Name', description: 'New desc', participants: [...] }

        validateChannelUpdate(updates); // Validate updates specific to channel

        const updatedChannel = await channelService.updateChannel(channelId, currentUserId, updates);
        res.status(200).json({ success: true, message: 'Channel updated successfully', channel: updatedChannel });
    } catch (error) {
        next(error);
    }
};

export const leaveChannel = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const userId = req.user.id;

        await channelService.removeParticipantFromChannel(channelId, userId, userId); // User leaving themselves
        res.status(200).json({ success: true, message: 'Successfully left channel.' });
    } catch (error) {
        next(error);
    }
};

export const removeParticipant = async (req, res, next) => {
    try {
        const { channelId, participantId } = req.params;
        const currentUserId = req.user.id; // Admin performing the action

        await channelService.removeParticipantFromChannel(channelId, participantId, currentUserId);
        res.status(200).json({ success: true, message: 'Participant removed successfully.' });
    } catch (error) {
        next(error);
    }
};

export const addParticipant = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const { userIdToAdd } = req.body;
        const currentUserId = req.user.id; // Admin performing the action

        await channelService.addParticipantToChannel(channelId, userIdToAdd, currentUserId);
        res.status(200).json({ success: true, message: 'Participant added successfully.' });
    } catch (error) {
        next(error);
    }
};

export const updateChannelPicture = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const currentUserId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const { url, public_id } = await uploadService.uploadFile(req.file, { folder: 'channel_pictures', channelId: channelId });
        const updatedChannel = await channelService.updateChannelPicture(channelId, currentUserId, url, public_id);

        res.status(200).json({ success: true, message: 'Channel picture updated', channelPictureUrl: url, public_id: public_id });
    } catch (error) {
        next(error);
    }
};

export const promoteToAdmin = async (req, res, next) => {
    try {
        const { channelId, userIdToPromote } = req.params;
        const currentUserId = req.user.id; // Admin performing the action

        await channelService.changeParticipantRole(channelId, userIdToPromote, 'promote', currentUserId);
        res.status(200).json({ success: true, message: 'Participant promoted to admin.' });
    } catch (error) {
        next(error);
    }
};

export const demoteFromAdmin = async (req, res, next) => {
    try {
        const { channelId, userIdToDemote } = req.params;
        const currentUserId = req.user.id; // Admin performing the action

        await channelService.changeParticipantRole(channelId, userIdToDemote, 'demote', currentUserId);
        res.status(200).json({ success: true, message: 'Participant demoted from admin.' });
    } catch (error) {
        next(error);
    }
};
