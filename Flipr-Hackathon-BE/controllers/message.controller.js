// backend/src/controllers/messageController.js
import messageService from '../services/message.service.js';
import { validateMessageReaction, validateMessageEdit } from '../utils/validation.js';

export const getMessagesByChannel = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const { limit = 50, skip = 0 } = req.query; // Default pagination values

        const messages = await messageService.getMessagesByChannel(channelId, parseInt(limit), parseInt(skip));
        res.status(200).json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};

export const getMessageById = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const message = await messageService.getMessageById(messageId);
        res.status(200).json({ success: true, message });
    } catch (error) {
        next(error);
    }
};

export const searchMessages = async (req, res, next) => {
    try {
        const { channelId } = req.params; // Optional: search within a specific channel
        const { query, limit = 50, skip = 0 } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ success: false, message: 'Search query is required.' });
        }

        const messages = await messageService.searchMessages(query, channelId, parseInt(limit), parseInt(skip));
        res.status(200).json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};

export const addReaction = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user.id; // User reacting to the message

        validateMessageReaction({ emoji });

        const updatedMessage = await messageService.addReactionToMessage(messageId, userId, emoji);
        res.status(200).json({ success: true, message: 'Reaction added', message: updatedMessage });
    } catch (error) {
        next(error);
    }
};

export const removeReaction = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user.id; // User removing the reaction

        validateMessageReaction({ emoji }); // Validate emoji for removal

        const updatedMessage = await messageService.removeReactionFromMessage(messageId, userId, emoji);
        res.status(200).json({ success: true, message: 'Reaction removed', message: updatedMessage });
    } catch (error) {
        next(error);
    }
};

export const updateMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const { newContent } = req.body;
        const userId = req.user.id; // User who sent the message

        validateMessageEdit({ newContent });

        const updatedMessage = await messageService.updateMessageContent(messageId, userId, newContent);
        res.status(200).json({ success: true, message: 'Message updated', message: updatedMessage });
    } catch (error) {
        next(error);
    }
};

export const deleteMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id; // User attempting to delete

        // Implement soft delete
        await messageService.deleteMessage(messageId, userId);
        res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const pinMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id; // User performing the action (must be admin/participant)

        const updatedMessage = await messageService.pinMessage(messageId, userId);
        res.status(200).json({ success: true, message: 'Message pinned', message: updatedMessage });
    } catch (error) {
        next(error);
    }
};

export const unpinMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id; // User performing the action

        const updatedMessage = await messageService.unpinMessage(messageId, userId);
        res.status(200).json({ success: true, message: 'Message unpinned', message: updatedMessage });
    } catch (error) {
        next(error);
    }
};

export const getLinkPreview = async (req, res, next) => {
    try {
        const { url } = req.query; // Link to generate preview for

        if (!url) {
            return res.status(400).json({ success: false, message: 'URL is required for link preview.' });
        }

        const previewData = await messageService.generateLinkPreview(url);
        res.status(200).json({ success: true, preview: previewData });
    } catch (error) {
        next(error);
    }
};