
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyMail = async (token, email) => {
    const verificationLink =
        `https://my-store-nine-sand-65.vercel.app/user/verify/${token}`;

    const { data, error } = await resend.emails.send({
        from: "MyStore <onboarding@resend.dev>",
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
    });

    if (error) {
        console.error("Resend email error:", error);
        throw new Error(error.message);
    }

    console.log("Verification email sent:", data.id);

    return data;
};
