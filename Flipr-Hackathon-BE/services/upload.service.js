// backend/src/services/uploadService.js
import cloudinary from 'cloudinary';
import CustomError from '../utils/CustomError.js';

// Configure Cloudinary (ensure environment variables are set)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadService = {
    async uploadFile(file, options = {}) {
        if (!file || !file.buffer) {
            throw new CustomError('No file buffer provided for upload.', 400);
        }

        try {
            const uploadOptions = {
                folder: options.folder || 'general', // Default folder in Cloudinary
                resource_type: 'auto', // Auto-detect resource type (image, video, raw)
                public_id: options.public_id || undefined, // Allow specifying public_id for updates/overwrites
                // transformation: [{ width: 500, height: 500, crop: "limit" }] // Example for images
            };

            // Use data URI for buffer upload
            const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

            const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

            return {
                url: result.secure_url,
                public_id: result.public_id,
                mimeType: result.format ? `${result.resource_type}/${result.format}` : file.mimetype, // Derive more accurate mimeType if possible
                size: result.bytes || file.size // Cloudinary reports bytes
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new CustomError('File upload failed. ' + error.message, 500);
        }
    },

    async deleteFile(public_id) {
        try {
            if (!public_id) {
                throw new CustomError('Public ID is required to delete a file.', 400);
            }
            await cloudinary.uploader.destroy(public_id);
            return { message: 'File deleted successfully' };
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            throw new CustomError('File deletion failed. ' + error.message, 500);
        }
    }
};

export default uploadService;