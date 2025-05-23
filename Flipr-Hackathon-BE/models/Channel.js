// models/Channel.js
import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: [50, 'Channel name cannot exceed 50 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    type: {
        type: String,
        enum: ['private', 'group'],
        required: true,
        message: '{VALUE} is not a valid channel type. Must be "private" or "group".'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() { return this.type === 'group'; }
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    channelPicture: { // For group chat avatars
        type: String,
        default: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/default_avatar.png' // Placeholder for a default avatar
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// --- Indexes for Efficient Querying and Uniqueness ---

// 1. Compound unique index for private channels with exactly two participants
ChannelSchema.index(
    { participants: 1, type: 1 },
    {
        unique: true,
        partialFilterExpression: { type: 'private', participants: { $size: 2 } }
    }
);

// 2. Unique index for group channel names
ChannelSchema.index(
    { name: 1, type: 1 },
    {
        unique: true,
        partialFilterExpression: { type: 'group' }
    }
);

// --- Middleware/Pre-Hooks for Channel Logic ---

ChannelSchema.pre('save', function(next) {
    // Enforce name for group chats
    if (this.type === 'group' && (!this.name || this.name.trim() === '')) {
        return next(new Error('Group channels must have a name.'));
    }
    // Enforce exactly two participants for private channels
    if (this.type === 'private' && this.participants.length !== 2) {
        return next(new Error('Private channels must have exactly two participants.'));
    }
    // Sort participants array for consistent indexing in private chats
    if (this.type === 'private') {
        this.participants = this.participants.sort((a, b) => a.toString().localeCompare(b.toString()));
    }
    next();
});

const Channel = mongoose.model('Channel', ChannelSchema);
export default Channel;