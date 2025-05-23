// backend/src/controllers/uploadController.js
import uploadService from '../services/upload.service.js';

export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // The upload service determines the folder/options based on context (e.g., mimeType)
        // or could receive explicit folder/options from the client/route.
        const { url, public_id, mimeType, size } = await uploadService.uploadFile(req.file, {
            folder: 'chat_media', // Default folder for general chat media
            userId: req.user.id // Pass user context if needed for permissions/organization
        });

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            file: {
                url,
                public_id,
                fileName: req.file.originalname,
                fileSize: size,
                mimeType: mimeType || req.file.mimetype // Use detected mimeType or fallback to multer's
            }
        });
    } catch (error) {
        next(error);
    }
};