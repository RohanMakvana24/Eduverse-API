import "dotenv/config";
import nodemailer from "nodemailer";
import emailVerificationTemp from "../templates/emailVerification.js";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_PASSWORD
    }
});

/**
 * Dynamically sends email with either OTP or link
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} name - User's name
 * @param {string} otpOrLink - Either the OTP (like '123456') or a link (like 'https://...')
 */
export const sendEmail = async (to, subject, name, otpOrLink) => {
    try {
        let html;

        // Determine if it's an OTP or a link
        if (/^\d{4,8}$/.test(otpOrLink)) {
            html = emailVerificationTemp({name, otp: otpOrLink});
        } else if (/^https?:\/\/[^\s]+$/.test(otpOrLink)) {
            html = emailVerificationTemp({name, link: otpOrLink});
        } else {
            console.error("Invalid OTP or Link format:", otpOrLink);
            return;
        }

        const info = await transporter.sendMail({from: '"EduVerse" <rohanmakvana90@gmail.com>', to, subject, html});

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error(" Email send failed:", error);
    }
};
