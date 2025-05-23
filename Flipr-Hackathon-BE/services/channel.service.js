// backend/src/services/channelService.js
import Channel from '../models/Channel.js';
import User from '../models/User.js'; // Needed for participant validation
import CustomError from '../utils/CustomError.js';
import uploadService from './upload.service.js'; // To delete old channel pictures if updated

const channelService = {
    async createChannel({ name, type, participants, admin, description }) {
        // Validate participants exist and are unique ObjectIds
        const uniqueParticipantIds = [...new Set(participants.map(id => id.toString()))];
        if (uniqueParticipantIds.length !== participants.length) {
            throw new CustomError('Duplicate participants provided.', 400);
        }

        const existingUsers = await User.find({ _id: { $in: participants } });
        if (existingUsers.length !== participants.length) {
            throw new CustomError('One or more participants not found.', 404);
        }

        if (type === 'private') {
            if (participants.length !== 2) {
                throw new CustomError('Private channels must have exactly two participants.', 400);
            }
            // Ensure participants are sorted consistently for the unique index check
            participants.sort((a, b) => a.toString().localeCompare(b.toString()));

            // Check if a private channel between these two already exists
            const existingPrivateChannel = await Channel.findOne({
                type: 'private',
                participants: { $all: participants, $size: 2 } // Use $all and $size for exact match regardless of order
            });
            if (existingPrivateChannel) {
                return existingPrivateChannel; // Return existing channel instead of throwing error
                // Or, if strict uniqueness is needed, throw: throw new CustomError('Private chat already exists between these users.', 409);
            }
        } else if (type === 'group') {
            if (!name || name.trim() === '') {
                throw new CustomError('Group channels must have a name.', 400);
            }
            if (!admin || !participants.includes(admin)) {
                throw new CustomError('Admin must be one of the participants for a group channel.', 400);
            }
            // Check for existing group name uniqueness (handled by model index, but explicit check for better error message)
            const existingGroup = await Channel.findOne({ name, type: 'group' });
            if (existingGroup) {
                throw new CustomError(`Group with name "${name}" already exists.`, 409);
            }
        } else {
            throw new CustomError('Invalid channel type.', 400);
        }

        const newChannel = await Channel.create({
            name,
            type,
            participants,
            admin,
            description
        });

        // Populate participants for the response
        await newChannel.populate('participants', 'username profilePicture isOnline');

        return newChannel;
    },

    async getChannelsForUser(userId) {
        // Find channels where the user is a participant
        const channels = await Channel.find({ participants: userId })
            .populate('participants', 'username profilePicture isOnline')
            .populate('lastMessage') // Populate lastMessage for chat list preview
            .sort({ updatedAt: -1 }); // Sort by most recent activity

        // For private channels, ensure lastMessage also populates sender for preview
        for (let channel of channels) {
            if (channel.type === 'private' && channel.lastMessage) {
                await channel.lastMessage.populate('sender', 'username');
            }
        }

        return channels;
    },

    async getChannelById(channelId, currentUserId) {
        const channel = await Channel.findById(channelId)
            .populate('participants', 'username profilePicture isOnline')
            .populate('admin', 'username profilePicture');

        if (!channel) {
            throw new CustomError('Channel not found.', 404);
        }

        // Ensure the current user is a participant of this channel
        if (!channel.participants.some(p => p._id.toString() === currentUserId.toString())) {
            throw new CustomError('Not authorized to access this channel.', 403);
        }

        return channel;
    },

    async updateChannel(channelId, currentUserId, updates) {
        const channel = await Channel.findById(channelId);

        if (!channel) {
            throw new CustomError('Channel not found.', 404);
        }

        // Only group admins or channel creator can update a group channel
        // For private channels, updates are usually not allowed or very limited
        if (channel.type === 'group' && channel.admin.toString() !== currentUserId.toString()) {
            throw new CustomError('Only the group admin can update this channel.', 403);
        }
        if (channel.type === 'private') {
            throw new CustomError('Private channels cannot be updated via this route.', 400);
        }


        // Apply updates
        if (updates.name) channel.name = updates.name;
        if (updates.description) channel.description = updates.description;
        // Participants and admin changes should be handled by dedicated methods below for complex logic/permissions

        await channel.save(); // Triggers pre-save hooks
        return channel.toObject({ getters: true, virtuals: false });
    },

    async removeParticipantFromChannel(channelId, participantIdToRemove, currentUserId) {
        const channel = await Channel.findById(channelId);
        if (!channel) {
            throw new CustomError('Channel not found.', 404);
        }

        if (channel.type === 'private') {
            throw new CustomError('Cannot remove participants from a private channel (delete the channel instead).', 400);
        }

        // Current user must be admin to remove others, or can remove themselves
        if (channel.admin.toString() !== currentUserId.toString() && participantIdToRemove.toString() !== currentUserId.toString()) {
            throw new CustomError('Not authorized to remove participants.', 403);
        }

        // Admin cannot remove themselves if they are the only admin and there are other participants
        if (channel.admin.toString() === participantIdToRemove.toString()) {
            const remainingAdmins = channel.participants.filter(p => p.toString() !== participantIdToRemove.toString() && p.toString() === channel.admin.toString());
            if (remainingAdmins.length === 0 && channel.participants.length > 1) {
                 throw new CustomError('The admin cannot leave if they are the only admin and other participants remain.', 400);
            }
        }


        // Remove participant from array
        channel.participants = channel.participants.filter(p => p.toString() !== participantIdToRemove.toString());

        // If channel becomes empty after removal, delete it (optional, or handle differently)
        if (channel.participants.length === 0) {
            await channel.deleteOne(); // Use deleteOne for Mongoose 6+
            return { message: 'Channel deleted as all participants left.' };
        }

        // If the admin is removed, assign a new admin (e.g., first remaining participant)
        if (channel.admin.toString() === participantIdToRemove.toString() && channel.participants.length > 0) {
            channel.admin = channel.participants[0];
            await channel.save({ validateBeforeSave: false }); // Save without re-validating participants
        } else {
             await channel.save(); // Save the updated channel
        }

        return { message: 'Participant removed successfully.' };
    },

    async addParticipantToChannel(channelId, userIdToAdd, currentUserId) {
        const channel = await Channel.findById(channelId);
        if (!channel) {
            throw new CustomError('Channel not found.', 404);
        }

        if (channel.type === 'private') {
            throw new CustomError('Cannot add participants to a private channel.', 400);
        }

        // Only admin can add participants
        if (channel.admin.toString() !== currentUserId.toString()) {
            throw new CustomError('Only the group admin can add participants.', 403);
        }

        // Check if user to add exists
        const userToAdd = await User.findById(userIdToAdd);
        if (!userToAdd) {
            throw new CustomError('User to add not found.', 404);
        }

        // Check if user is already a participant
        if (channel.participants.includes(userIdToAdd)) {
            throw new CustomError('User is already a participant in this channel.', 400);
        }

        channel.participants.push(userIdToAdd);
        await channel.save();
        return { message: 'Participant added successfully.', channel };
    },

    async updateChannelPicture(channelId, currentUserId, newImageUrl, publicId) {
        const channel = await Channel.findById(channelId);
        if (!channel) {
            throw new CustomError('Channel not found.', 404);
        }

        if (channel.type === 'private') {
            throw new CustomError('Private channels do not have a separate picture.', 400);
        }

        if (channel.admin.toString() !== currentUserId.toString()) {
            throw new CustomError('Only the group admin can update the channel picture.', 403);
        }

        // Delete old picture from cloud storage if it exists
        if (channel.channelPicture && channel.channelPicture.includes('cloudinary.com')) {
            // Extract public_id from the URL or store it separately in the model
            // For now, assuming public_id might be stored in the URL or a separate field
            // A more robust solution would store both URL and public_id in the model.
            // If the model stored public_id directly: await uploadService.deleteFile(channel.channelPicturePublicId);
            // Example of extracting public_id from a Cloudinary URL:
            const oldPublicIdMatch = channel.channelPicture.match(/\/v\d+\/([^\/]+)\.\w{3,4}$/);
            if(oldPublicIdMatch && oldPublicIdMatch[1]) {
                await uploadService.deleteFile(oldPublicIdMatch[1]);
            }
        }

        channel.channelPicture = newImageUrl;
        // Optionally, store the public_id from the new upload as well
        // channel.channelPicturePublicId = publicId;

        await channel.save();
        return channel;
    },

    async changeParticipantRole(channelId, targetUserId, action, currentUserId) {
        const channel = await Channel.findById(channelId);
        if (!channel) {
            throw new CustomError('Channel not found.', 404);
        }

        if (channel.type === 'private') {
            throw new CustomError('Roles cannot be managed in private channels.', 400);
        }

        if (channel.admin.toString() !== currentUserId.toString()) {
            throw new CustomError('Only the group admin can manage roles.', 403);
        }

        if (!channel.participants.includes(targetUserId)) {
            throw new CustomError('Target user is not a participant in this channel.', 400);
        }

        if (action === 'promote') {
            if (channel.admin.toString() === targetUserId.toString()) {
                throw new CustomError('User is already an admin.', 400);
            }
            channel.admin = targetUserId; // Simply reassigning admin for now (assuming single admin)
                                       // For multiple admins, would need an array of admin IDs.
        } else if (action === 'demote') {
            if (channel.admin.toString() !== targetUserId.toString()) {
                throw new CustomError('User is not an admin.', 400);
            }
            // If demoting the current admin, reassign to another participant
            const remainingParticipants = channel.participants.filter(p => p.toString() !== targetUserId.toString());
            if (remainingParticipants.length === 0) {
                throw new CustomError('Cannot demote the only participant.', 400);
            }
            channel.admin = remainingParticipants[0]; // Assign first remaining participant as new admin
        } else {
            throw new CustomError('Invalid role action.', 400);
        }

        await channel.save();
        return { message: `Participant role updated: ${action}`, channel };
    }
};

export default channelService;