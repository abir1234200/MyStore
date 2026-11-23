import mongoose from "mongoose";


const addressSchema = new mongoose.Schema(
    {
        addressLine1: {
            type: String,
            required: true,
            trim: true
        },

        addressLine2: {
            type: String,
            default: "",
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        },

        postalCode: {
            type: String,
            required: true,
            trim: true
        },

        country: {
            type: String,
            default: "India",
            trim: true
        },

        isDefault: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);



const userSchema = new mongoose.Schema(
    {

        userName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },


        token: {
            type: String,
            default: ""
        },

        verified: {
            type: Boolean,
            default: false
        },

        isLoggedIn: {
            type: Boolean,
            default: false
        },

        isSeller: {
            type: Boolean,
            default: false
        },

        sellerUpiId: {
            type: String,
            trim: true,
            default: ""
        },

        sellerVerificationStatus: {
            type: String,
            enum: [
                "not_submitted",
                "pending",
                "approved",
                "rejected"
            ],
            default: "not_submitted"
        },

        addresses: {
            type: [addressSchema],
            default: []
        }

    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;
