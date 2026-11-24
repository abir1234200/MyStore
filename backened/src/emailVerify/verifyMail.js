
import nodemailer from "nodemailer";
import dotenv from "dotenv/config";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.mailUser,
        pass: process.env.mailPass,
    },

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
});

export const verifyMail = async (token, email) => {
    const verificationLink = `https://my-store-nine-sand-65.vercel.app/user/verify/${token}`;

    const mailOptions = {
        from: process.env.mailUser,
        to: email,
        subject: "Verify Your Email",

        html: `
            <h2>Welcome to MyStore!</h2>

            <p>Please click the link below to verify your email:</p>

            <a href="${verificationLink}">
                Verify Email
            </a>

            <p>This verification link expires in 5 minutes.</p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Verification email sent:", info.messageId);

    return info;
};
