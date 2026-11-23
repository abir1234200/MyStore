
import mongoose from "mongoose";

import orderSchema from "../models/orderSchema.js";
import cartSchema from "../models/cartSchema.js";
import productSchema from "../models/productSchema.js";


export const placeOrder = async (req, res) => {
    let session;

    try {
        const {
            shippingAddress,
            paymentMethod,
            productId,
            quantity
        } = req.body;


        if (paymentMethod !== "COD") {
            return res.status(400).json({
                success: false,
                message: "Use Razorpay for online payments",
            });
        }


        if (
            typeof shippingAddress !== "string" ||
            !shippingAddress.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required",
            });
        }


        const isBuyNow = productId !== undefined;


        if (isBuyNow) {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID",
                });
            }

            if (
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product quantity",
                });
            }
        }


        session = await mongoose.startSession();

        let createdOrder;

        await session.withTransaction(async () => {

            let orderItems = [];
            let totalAmount = 0;
            let cart = null;



            if (isBuyNow) {


                const product = await productSchema
                    .findById(productId)
                    .session(session);

                if (!product) {
                    throw new Error(
                        "Product does not exist"
                    );
                }

                if (product.isActive !== true) {
                    throw new Error(
                        `${product.name} is inactive`
                    );
                }

                if (quantity > product.stock) {
                    throw new Error(
                        `${product.name} has insufficient stock. Available stock: ${product.stock}`
                    );
                }

                totalAmount = product.price * quantity;

                orderItems.push({
                    product: product._id,
                    seller: product.seller,
                    quantity: quantity,
                    price: product.price,
                });
            }



            else {


                cart = await cartSchema.findOne({
                    user: req.userId,
                }).session(session);

                if (!cart || cart.items.length === 0) {
                    throw new Error("Your cart is empty");
                }


                for (const item of cart.items) {

                    const product = await productSchema
                        .findById(item.product)
                        .session(session);

                    if (!product) {
                        throw new Error(
                            "Product ID does not exist in database"
                        );
                    }

                    if (product.isActive !== true) {
                        throw new Error(
                            `${product.name} is inactive`
                        );
                    }

                    if (item.quantity > product.stock) {
                        throw new Error(
                            `${product.name} has insufficient stock. Available stock: ${product.stock}`
                        );
                    }

                    totalAmount += product.price * item.quantity;

                    orderItems.push({
                        product: product._id,
                        seller: product.seller,
                        quantity: item.quantity,
                        price: product.price,
                    });
                }
            }

            totalAmount = Math.round(totalAmount * 100) / 100;



            for (const item of orderItems) {

                const result = await productSchema.updateOne(
                    {
                        _id: item.product,
                        isActive: true,
                        stock: {
                            $gte: item.quantity
                        },
                    },
                    {
                        $inc: {
                            stock: -item.quantity,
                        },
                    },
                    {
                        session
                    }
                );

                if (result.modifiedCount !== 1) {
                    throw new Error(
                        "Product stock changed. Please try again"
                    );
                }
            }



            const orders = await orderSchema.create(
                [{
                    user: req.userId,
                    items: orderItems,
                    totalAmount,
                    shippingAddress: shippingAddress.trim(),
                    paymentMethod: "COD",
                    paymentStatus: "PENDING",
                    orderStatus: "PLACED",
                }],
                {
                    session
                }
            );

            createdOrder = orders[0];



            if (!isBuyNow) {

                const cartResult = await cartSchema.updateOne(
                    {
                        _id: cart._id,
                        user: req.userId,
                    },
                    {
                        $set: {
                            items: [],
                        },
                    },
                    {
                        session
                    }
                );

                if (cartResult.matchedCount !== 1) {
                    throw new Error("Cart not found");
                }
            }

        });

        return res.status(201).json({
            success: true,
            message: isBuyNow
                ? "Individual COD order placed successfully"
                : "COD order placed successfully",
            order: createdOrder,
        });

    } catch (error) {

        console.log("Place order error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    } finally {

        if (session) {
            await session.endSession();
        }
    }
};



export const getMyOrders = async (req, res) => {
    try {
        const orders = await orderSchema
            .find({
                user: req.userId,
            })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {

        console.log("Get my orders error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
