import 'dotenv/config';
import nodemailer from "nodemailer";
import emailVerificationTemp from "../templates/emailVerification.js";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (to, subject, name, otp) => {
    try {
        const info = await transporter.sendMail({
            from: '"EduVerse" <rohanmakvana90@gmail.com>', // Customizable sender name
            to,
            subject,
            html: emailVerificationTemp(name, otp)
        });
    } catch (error) {
        console.error("❌ Email send failed:", error);
    }
}
