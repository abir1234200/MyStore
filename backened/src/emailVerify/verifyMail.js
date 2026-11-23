import nodemailer from "nodemailer";
import dotenv from "dotenv/config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.mailUser,
        pass: process.env.mailPass,
    },
});

export const verifyMail = async (token, email) => {
    const verificationLink = `http://localhost:5173/user/verify/${token}`;

    const mailOptions = {
        from: process.env.mailUser,
        to: email,
        subject: "Verify Your Email",
        html: `
            <h2>Welcome to Our E-commerce Website!</h2>
            <p>Please click the link below to verify your email:</p>
            <a href="${verificationLink}">Verify Email</a>
        `,
    };

    await transporter.sendMail(mailOptions);
};