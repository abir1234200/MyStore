
import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema.js";

export const verification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Verification token is required",
            });
        }

        const token = authHeader.split(" ")[1];

      
        const decoded = jwt.verify(
            token,
            process.env.secretKey
        );

        
        const user = await userSchema.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        
        if (user.verified) {
            return res.status(200).json({
                success: true,
                message: "Email already verified",
            });
        }

       
        if (user.token !== token) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification token",
            });
        }

    
        user.verified = true;
        user.token = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired verification token",
        });
    }
};
