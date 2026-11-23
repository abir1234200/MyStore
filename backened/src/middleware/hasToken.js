import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema.js";
import sessionSchema from "../models/sessionSchema.js";

export const hasToken = async (req, res, next) => {
    try {
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        
        const token = authHeader.split(" ")[1];

       
        const decoded = jwt.verify(token, process.env.secretKey);

        
        const user = await userSchema.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        
        const session = await sessionSchema.findOne({
            userId: user._id,
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Please login again",
            });
        }

    
        req.userId = user._id;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};