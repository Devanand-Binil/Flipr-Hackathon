// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    profilePicture: {
        type: String, // URL to the user's profile picture
        default: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/default_avatar.png' // Placeholder for a default avatar
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastOnline: {
        type: Date,
        default: Date.now
    },
    notifications: {
        emailEnabled: { type: Boolean, default: true },
        realtimeEnabled: { type: Boolean, default: true },
        // Add more specific notification settings as needed
    },
    themePreference: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    resetPasswordToken: { // For password recovery
        type: String
    },
    resetPasswordExpires: { // Expiry date for the reset token
        type: Date
    },
    refreshTokens: [ // New array to store hashed refresh tokens
        {
            token: { // Storing the hashed token
                type: String,
                required: true
            },
            expiresAt: { // Expiry for this specific refresh token
                type: Date,
                required: true
            },
            createdAt: { // When this token was generated
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true // Mongoose will automatically manage createdAt and updatedAt
});

// Hash password before saving the user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;