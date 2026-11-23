import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "todoUser_backend",
        required: true,
        unique: true,
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
            },
        },
    ],

}, { timestamps: true });

export default mongoose.model("cart", cartSchema);