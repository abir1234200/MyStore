import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "todoUser_backend",
        required: true,
        unique: true,
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },
    ],

}, { timestamps: true });

export default mongoose.model("wishlist", wishlistSchema);