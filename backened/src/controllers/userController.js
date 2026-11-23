import userSchema from "../models/userSchema.js";
import sessionSchema from "../models/sessionSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyMail } from "../emailVerify/verifyMail.js";


export const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const existing = await userSchema.findOne({ email });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userSchema.create({
            userName,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.secretKey,
            { expiresIn: "5m" }
        );

        user.token = token;
        await user.save();

        await verifyMail(token, email);

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userSchema.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordCheck = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before login"
            });
        }

        await sessionSchema.findOneAndDelete({
            userId: user._id
        });

        await sessionSchema.create({
            userId: user._id
        });

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.secretKey,
            { expiresIn: "10days" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.secretKey,
            { expiresIn: "30days" }
        );

        user.isLoggedIn = true;
        await user.save();

        const userData = user.toObject();

        delete userData.password;
        delete userData.token;

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken,
            refreshToken,
            data: userData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const logout = async (req, res) => {
    try {
        const existing = await sessionSchema.findOne({
            userId: req.userId
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "User has no active session"
            });
        }

        await sessionSchema.findOneAndDelete({
            userId: req.userId
        });

        await userSchema.findByIdAndUpdate(
            req.userId,
            { isLoggedIn: false }
        );

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




export const becomeSeller = async (req, res) => {
    try {
        const user = await userSchema.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isSeller) {
            return res.status(400).json({
                success: false,
                message: "You are already a seller"
            });
        }

        const { upiId } = req.body;

        if (!upiId || typeof upiId !== "string") {
            return res.status(400).json({
                success: false,
                message: "UPI ID is required"
            });
        }

        const cleanUpiId = upiId.trim();

        const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

        if (!upiPattern.test(cleanUpiId)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid UPI ID"
            });
        }

        
        user.sellerUpiId = cleanUpiId;
        user.isSeller = true;
        user.sellerVerificationStatus = "approved";

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Congratulations! You are now a seller.",
            isSeller: true,
            verificationStatus: "approved"
        });

    } catch (error) {
        console.error("Become seller error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to register as seller"
        });
    }
};




export const getProfile = async (req, res) => {
    try {
        const user = await userSchema.findById(req.userId)
            .select("userName email");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                userName: user.userName,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




export const getAddresses = async (req, res) => {
    try {
        const user = await userSchema.findById(req.userId)
            .select("addresses");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            addresses: user.addresses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




export const addAddress = async (req, res) => {
    try {
        const {
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            isDefault
        } = req.body;

        if (
            !addressLine1 ||
            !city ||
            !state ||
            !postalCode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required address details"
            });
        }

        const user = await userSchema.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const makeDefault =
            Boolean(isDefault) || user.addresses.length === 0;

        if (makeDefault) {
            user.addresses.forEach((address) => {
                address.isDefault = false;
            });
        }

        user.addresses.push({
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country: country || "India",
            isDefault: makeDefault
        });

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            addresses: user.addresses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await userSchema.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        const fields = [
            "addressLine1",
            "addressLine2",
            "city",
            "state",
            "postalCode",
            "country"
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                address[field] = req.body[field];
            }
        });

        if (req.body.isDefault === true) {
            user.addresses.forEach((item) => {
                item.isDefault = false;
            });

            address.isDefault = true;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            addresses: user.addresses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await userSchema.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        const wasDefault = address.isDefault;

        user.addresses.pull(addressId);

        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            addresses: user.addresses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




export const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await userSchema.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        user.addresses.forEach((item) => {
            item.isDefault = false;
        });

        address.isDefault = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            addresses: user.addresses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
