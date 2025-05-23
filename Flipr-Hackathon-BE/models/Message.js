// models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    channel: { // Reference to the conversation/channel it belongs to
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    content: {
        type: String, // For text messages
        trim: true,
        maxlength: [2000, 'Message content cannot exceed 2000 characters']
    },
    file: { // For images, GIFs, audio, video, documents
        url: {
            type: String // URL to the file stored in cloud storage
        },
        public_id: { // Cloudinary public_id or similar identifier
            type: String
        },
        fileName: {
            type: String // Original name of the uploaded file
        },
        fileSize: {
            type: Number // Size in bytes
        },
        mimeType: {
            type: String // e.g., 'image/jpeg', 'audio/mpeg'
        }
    },
    type: {
        type: String,
        enum: ['text', 'image', 'gif', 'audio', 'video', 'document', 'linkPreview'],
        default: 'text',
        required: true,
        message: '{VALUE} is not a valid message type.'
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    deliveredTo: [{ // For message delivery status indicators
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    readBy: [{ // For read receipts
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reactions: [{ // For message reactions
        _id: false, // Don't create a separate _id for subdocuments in array
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        emoji: { type: String, required: true } // e.g., '👍', '❤️', '😂'
    }],
    replyTo: { // For message threading/replies
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    isPinned: { // For pinning important messages
        type: Boolean,
        default: false
    },
    isEdited: { // For message editing
        type: Boolean,
        default: false
    },
    deletedBy: { // For message deletion (soft delete)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    linkPreview: { // For link previews
        _id: false,
        url: { type: String },
        title: { type: String },
        description: { type: String },
        imageUrl: { type: String }
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// --- Indexes ---
// Index for efficient retrieval of messages within a channel, sorted by time
MessageSchema.index({ channel: 1, sentAt: 1 });

// Text index on content for message search functionality
MessageSchema.index({ content: 'text' });

const Message = mongoose.model('Message', MessageSchema);
export default Message;