import userSchema from "../models/userSchema.js";

export const isSeller = async (req, res, next) => {
    try {
        const user = await userSchema.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.isSeller) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Seller permission required.",
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};