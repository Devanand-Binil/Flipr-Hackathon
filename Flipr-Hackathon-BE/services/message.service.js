// backend/src/services/messageService.js
import Message from '../models/Message.js';
import Channel from '../models/Channel.js'; // To update lastMessage on channel
import User from '../models/User.js'; // To validate sender/users
import CustomError from '../utils/CustomError.js';
import axios from 'axios'; // For link previews

const messageService = {
    async createMessage({ sender, channel, content, file = {}, type = 'text', replyTo = null }) {
        const existingChannel = await Channel.findById(channel);
        if (!existingChannel) {
            throw new CustomError('Channel not found.', 404);
        }

        const senderUser = await User.findById(sender);
        if (!senderUser) {
            throw new CustomError('Sender user not found.', 404);
        }
        // Ensure sender is a participant of the channel
        if (!existingChannel.participants.includes(sender)) {
             throw new CustomError('Sender is not a participant of this channel.', 403);
        }

        const newMessage = await Message.create({
            sender,
            channel,
            content: type === 'text' ? content : undefined, // Only set content for text messages
            file: type !== 'text' ? file : undefined, // Only set file for non-text messages
            type,
            replyTo,
            sentAt: Date.now(),
            readBy: [sender], // Sender automatically reads their own message
            deliveredTo: [sender] // Sender's device receives the message
        });

        // Update the lastMessage in the Channel model
        existingChannel.lastMessage = newMessage._id;
        await existingChannel.save();

        // Populate sender and replyTo for real-time delivery or immediate response
        await newMessage.populate('sender', 'username profilePicture');
        if (newMessage.replyTo) {
            await newMessage.populate('replyTo', 'content type'); // Populate content/type for replied message preview
        }

        return newMessage;
    },

    async getMessagesByChannel(channelId, limit, skip) {
        const messages = await Message.find({ channel: channelId })
            .populate('sender', 'username profilePicture')
            .populate('reactions.userId', 'username') // Populate user who reacted
            .populate('replyTo', 'content type sender') // Populate replied message data
            .sort({ sentAt: 1 }) // Ascending order for chat history
            .skip(skip)
            .limit(limit);

        // Further populate sender of replied message if exists
        for (let message of messages) {
            if (message.replyTo && message.replyTo.sender) {
                await message.replyTo.populate('sender', 'username');
            }
        }

        return messages;
    },

    async getMessageById(messageId) {
        const message = await Message.findById(messageId)
            .populate('sender', 'username profilePicture')
            .populate('reactions.userId', 'username')
            .populate('replyTo', 'content type sender');

        if (!message) {
            throw new CustomError('Message not found.', 404);
        }
        // Further populate sender of replied message if exists
        if (message.replyTo && message.replyTo.sender) {
            await message.replyTo.populate('sender', 'username');
        }

        return message;
    },

    async searchMessages(query, channelId = null, limit, skip) {
        const searchCriteria = {
            $text: { $search: query } // Requires text index on content field in MessageSchema
        };

        if (channelId) {
            searchCriteria.channel = channelId;
        }

        const messages = await Message.find(searchCriteria, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' }, sentAt: -1 }) // Sort by relevance and then by time
            .populate('sender', 'username profilePicture')
            .populate('channel', 'name type participants') // Include channel details for context
            .skip(skip)
            .limit(limit);

        return messages;
    },

    async addReactionToMessage(messageId, userId, emoji) {
        const message = await Message.findById(messageId);
        if (!message) {
            throw new CustomError('Message not found.', 404);
        }

        // Check if user already reacted with this emoji
        const existingReactionIndex = message.reactions.findIndex(
            r => r.userId.toString() === userId.toString() && r.emoji === emoji
        );

        if (existingReactionIndex === -1) {
            message.reactions.push({ userId, emoji });
        } else {
            // Optional: If user already reacted with this emoji, toggle it off
            // message.reactions.splice(existingReactionIndex, 1);
            throw new CustomError('You have already reacted with this emoji.', 400); // Or silently succeed
        }

        await message.save();
        await message.populate('reactions.userId', 'username'); // Re-populate for response
        return message;
    },

    async removeReactionFromMessage(messageId, userId, emoji) {
        const message = await Message.findById(messageId);
        if (!message) {
            throw new CustomError('Message not found.', 404);
        }

        const initialLength = message.reactions.length;
        message.reactions = message.reactions.filter(
            r => !(r.userId.toString() === userId.toString() && r.emoji === emoji)
        );

        if (message.reactions.length === initialLength) {
            throw new CustomError('No matching reaction found to remove.', 404);
        }

        await message.save();
        await message.populate('reactions.userId', 'username'); // Re-populate for response
        return message;
    },

    async updateMessageContent(messageId, userId, newContent) {
        const message = await Message.findById(messageId);
        if (!message) {
            throw new CustomError('Message not found.', 404);
        }
        if (message.sender.toString() !== userId.toString()) {
            throw new CustomError('Not authorized to edit this message.', 403);
        }
        if (message.type !== 'text') {
            throw new CustomError('Only text messages can be edited.', 400);
        }

        message.content = newContent;
        message.isEdited = true; // Mark as edited
        await message.save();
        return message;
    },

    async deleteMessage(messageId, userId) {
        const message = await Message.findById(messageId);
        if (!message) {
            throw new CustomError('Message not found.', 404);
        }

        const channel = await Channel.findById(message.channel);
        if (!channel) {
            throw new CustomError('Associated channel not found.', 404);
        }

        // Only sender or channel admin can delete
        const isAdmin = channel.admin && channel.admin.toString() === userId.toString();
        const isSender = message.sender.toString() === userId.toString();

        if (!isSender && !isAdmin) {
            throw new CustomError('Not authorized to delete this message.', 403);
        }

        // Soft delete: Mark as deleted by setting 'deletedBy' field
        message.deletedBy = userId;
        message.content = 'This message has been deleted.'; // Clear content
        message.file = undefined; // Clear file data
        message.reactions = []; // Clear reactions
        message.isEdited = true; // Mark as edited for deletion display purposes
        message.type = 'text'; // Change type to text for deleted message display

        await message.save();

        // Optional: If the deleted message was the lastMessage in channel, update channel.lastMessage
        if (channel.lastMessage && channel.lastMessage.toString() === messageId.toString()) {
            const previousMessage = await Message.findOne({ channel: channel._id, _id: { $ne: messageId } })
                                                  .sort({ sentAt: -1 });
            channel.lastMessage = previousMessage ? previousMessage._id : null;
            await channel.save();
        }

        return { message: 'Message soft-deleted successfully.' };
    },

    async pinMessage(messageId, userId) {
        const message = await Message.findById(messageId);
        if (!message) {
            throw new CustomError('Message not found.', 404);
        }
        const channel = await Channel.findById(message.channel);
        if (!channel) {
            throw new CustomError('Channel not found.', 404);
        }

        // Only channel admin can pin/unpin messages
        if (channel.admin.toString() !== userId.toString()) {
            throw new CustomError('Only channel admins can pin messages.', 403);
        }

        message.isPinned = true;
        await message.save();
        return message;
    },

    async unpinMessage(messageId, userId) {
        const message = await Message.findById(messageId);
        if (!message) {
            throw new CustomError('Message not found.', 404);
        }
        const channel = await Channel.findById(message.channel);
        if (!channel) {
            throw new CustomError('Channel not found.', 404);
        }

        // Only channel admin can pin/unpin messages
        if (channel.admin.toString() !== userId.toString()) {
            throw new CustomError('Only channel admins can unpin messages.', 403);
        }

        message.isPinned = false;
        await message.save();
        return message;
    },

    async generateLinkPreview(url) {
        try {
            // Basic URL validation
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                throw new CustomError('Invalid URL format for link preview.', 400);
            }

            // Using a third-party service or scraping for link previews
            // For a production app, consider using a dedicated link preview API or a more robust scraping library
            // For hackathon, a simple example could involve making a HEAD request or a GET request and parsing meta tags.
            const response = await axios.get(url, { maxRedirects: 5, timeout: 5000 });
            const html = response.data;

            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
            const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);

            const preview = {
                url: url,
                title: titleMatch ? titleMatch[1] : 'No title',
                description: descriptionMatch ? descriptionMatch[1] : 'No description',
                imageUrl: ogImageMatch ? ogImageMatch[1] : null,
            };

            return preview;
        } catch (error) {
            console.error('Error generating link preview for:', url, error.message);
            // Return a partial preview or indicate failure, don't block the message
            return {
                url: url,
                title: 'Link Preview Unavailable',
                description: 'Could not generate a preview for this link.',
                imageUrl: null,
            };
        }
    }
};

export default messageService;