// backend/src/middlewares/errorHandler.js
import CustomError from '../utils/CustomError.js'; // Assuming CustomError is defined

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log the error for development/debugging purposes
    console.error('Error:', err.stack);
    console.error('Error Name:', err.name);
    console.error('Error Code:', err.code); // For MongoDB unique key errors etc.

    // Mongoose Bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new CustomError(message, 404);
    }

    // Mongoose Duplicate Key Error (e.g., unique: true)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate field value: ${field} '${err.keyValue[field]}' entered. Please use another value.`;
        error = new CustomError(message, 400);
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        const message = messages.join(', ');
        error = new CustomError(message, 400);
    }

    // JWT Malformed Error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again.';
        error = new CustomError(message, 401);
    }

    // JWT Expired Error
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired. Please log in again.';
        error = new CustomError(message, 401);
    }

    // Custom Errors (from services)
    if (err instanceof CustomError) {
        error.statusCode = err.statusCode;
    } else {
        // Default to a 500 error for unhandled errors
        error.statusCode = error.statusCode || 500;
        error.message = error.message || 'Server Error';
    }


    res.status(error.statusCode).json({
        success: false,
        error: error.message || 'Server Error',
        // In development, you might send the stack trace
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default errorHandler;

// Also, you'll need this CustomError class
// backend/src/utils/CustomError.js
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Mark as operational error (expected error)

        Error.captureStackTrace(this, this.constructor);
    }
}
export { CustomError };