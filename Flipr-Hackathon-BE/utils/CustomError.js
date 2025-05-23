// backend/src/utils/CustomError.js

class CustomError extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent Error constructor
        this.statusCode = statusCode; // Custom HTTP status code
        this.isOperational = true; // Mark as an operational error (expected, handled error)

        // Capture the stack trace, excluding the constructor call itself
        Error.captureStackTrace(this, this.constructor);
    }
}

export { CustomError };