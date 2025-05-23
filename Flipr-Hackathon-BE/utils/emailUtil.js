// backend/src/utils/emailUtil.js
import nodemailer from 'nodemailer';
import { CustomError } from './CustomError.js'; // Import custom error

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Use this in development if you encounter issues with self-signed certs
    }
});

export const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            // html: options.html // Use html for rich content if needed
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // Do not re-throw as a critical error if it's not a core functionality failure
        // For password recovery, we handle it in authService by clearing tokens.
        // For notifications, it might be okay to just log and continue.
        throw new CustomError('Failed to send email. Please check server logs.', 500);
    }
};