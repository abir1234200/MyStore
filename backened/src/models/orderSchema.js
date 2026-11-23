
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "todoUser_backend",
        required: true,
    },

   
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },

            seller: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "todoUser_backend",
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
                min: 1,
            },

            price: {
                type: Number,
                required: true,
                min: 0,
            },
        },
    ],

  
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },

   
    shippingAddress: {
        type: String,
        required: true,
    },

   
    paymentMethod: {
        type: String,
        enum: ["COD", "ONLINE"],
        default: "COD",
    },


    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING",
    },

   
    razorpayOrderId: {
        type: String,
        unique: true,
        sparse: true,
    },

   
    razorpayPaymentId: {
        type: String,
        default: null,
    },

  
    orderStatus: {
        type: String,
        enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
        default: "PLACED",
    },

}, {
    timestamps: true,
});

export default mongoose.model("order", orderSchema);
