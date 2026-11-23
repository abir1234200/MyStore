
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import mongoose from "mongoose";

import cartSchema from "../models/cartSchema.js";
import productSchema from "../models/productSchema.js";
import orderSchema from "../models/orderSchema.js";



const getCartDetails = async (userId, session = null) => {
    let cartQuery = cartSchema.findOne({
        user: userId,
    });

    if (session) {
        cartQuery = cartQuery.session(session);
    }

    const cart = await cartQuery;

    if (!cart || cart.items.length === 0) {
        throw new Error("Your cart is empty");
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
        let productQuery = productSchema.findById(item.product);

        if (session) {
            productQuery = productQuery.session(session);
        }

        const product = await productQuery;

        if (!product) {
            throw new Error(
                "Product ID does not exist in database"
            );
        }

        if (product.isActive !== true) {
            throw new Error(`${product.name} is inactive`);
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

    return {
        cart,
        orderItems,
        totalAmount: Math.round(totalAmount * 100) / 100,
    };
};




const getSingleProductDetails = async (
    productId,
    quantity,
    session = null
) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Invalid product quantity");
    }

    let productQuery = productSchema.findById(productId);

    if (session) {
        productQuery = productQuery.session(session);
    }

    const product = await productQuery;

    if (!product) {
        throw new Error("Product does not exist");
    }

    if (product.isActive !== true) {
        throw new Error(`${product.name} is inactive`);
    }

    if (quantity > product.stock) {
        throw new Error(
            `${product.name} has insufficient stock. Available stock: ${product.stock}`
        );
    }

    const totalAmount = Math.round(
        product.price * quantity * 100
    ) / 100;

    const orderItems = [{
        product: product._id,
        seller: product.seller,
        quantity,
        price: product.price,
    }];

    return {
        product,
        orderItems,
        totalAmount,
    };
};




export const createPaymentOrder = async (req, res) => {
    try {
        const {
            shippingAddress,
            productId,
            quantity
        } = req.body;

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

        let totalAmount;

        let notes = {
            userId: req.userId.toString(),
            shippingAddress: shippingAddress.trim(),
            purchaseType: isBuyNow ? "BUY_NOW" : "CART",
        };


        if (isBuyNow) {
            const details = await getSingleProductDetails(
                productId,
                quantity
            );

            totalAmount = details.totalAmount;

            notes.productId = productId.toString();
            notes.quantity = quantity.toString();
        }


        else {
            const details = await getCartDetails(req.userId);

            totalAmount = details.totalAmount;
        }

        const amountInPaise = Math.round(
            totalAmount * 100
        );

        if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
            throw new Error("Invalid payment amount");
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes,
        });

        return res.status(201).json({
            success: true,
            message: "Payment order created successfully",
            order: razorpayOrder,
            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.log("Payment order error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};




export const verifyPayment = async (req, res) => {
    let session;

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are missing",
            });
        }


        const existingOrder = await orderSchema.findOne({
            $or: [
                { razorpayOrderId: razorpay_order_id },
                { razorpayPaymentId: razorpay_payment_id },
            ],
        });

        if (existingOrder) {
            if (
                existingOrder.user.toString() === req.userId.toString() &&
                existingOrder.razorpayOrderId === razorpay_order_id &&
                existingOrder.razorpayPaymentId === razorpay_payment_id
            ) {
                return res.status(200).json({
                    success: true,
                    message: "Order already created",
                    order: existingOrder,
                });
            }

            return res.status(409).json({
                success: false,
                message: "This payment has already been used",
            });
        }


        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        if (!/^[a-fA-F0-9]{64}$/.test(razorpay_signature)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        const expectedBuffer = Buffer.from(
            expectedSignature,
            "hex"
        );

        const receivedBuffer = Buffer.from(
            razorpay_signature,
            "hex"
        );

        const isValid =
            expectedBuffer.length === receivedBuffer.length &&
            crypto.timingSafeEqual(
                expectedBuffer,
                receivedBuffer
            );

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }


        const razorpayOrder = await razorpay.orders.fetch(
            razorpay_order_id
        );

        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );


        if (
            razorpayOrder.notes?.userId !== req.userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot verify another user's payment",
            });
        }

        if (payment.order_id !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Payment does not belong to this order",
            });
        }

        if (payment.status !== "captured") {
            return res.status(400).json({
                success: false,
                message: "Payment has not been captured",
            });
        }

        if (
            payment.currency !== "INR" ||
            payment.amount !== razorpayOrder.amount ||
            razorpayOrder.currency !== "INR"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment amount or currency mismatch",
            });
        }


        const purchaseType =
            razorpayOrder.notes?.purchaseType;

        const isBuyNow = purchaseType === "BUY_NOW";

        if (purchaseType !== "BUY_NOW" && purchaseType !== "CART") {
            return res.status(400).json({
                success: false,
                message: "Invalid purchase type",
            });
        }


        const shippingAddress =
            razorpayOrder.notes?.shippingAddress;

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address not found",
            });
        }


        session = await mongoose.startSession();

        let createdOrder;

        await session.withTransaction(async () => {


            const duplicate = await orderSchema.findOne({
                razorpayOrderId: razorpay_order_id,
            }).session(session);

            if (duplicate) {
                throw new Error(
                    "Order already created for this payment"
                );
            }

            let orderItems = [];
            let totalAmount = 0;
            let cart = null;



            if (isBuyNow) {

                const productId =
                    razorpayOrder.notes.productId;

                const quantity = Number(
                    razorpayOrder.notes.quantity
                );

                const details = await getSingleProductDetails(
                    productId,
                    quantity,
                    session
                );

                orderItems = details.orderItems;
                totalAmount = details.totalAmount;
            }



            else {

                const details = await getCartDetails(
                    req.userId,
                    session
                );

                cart = details.cart;
                orderItems = details.orderItems;
                totalAmount = details.totalAmount;
            }


            const expectedAmount = Math.round(
                totalAmount * 100
            );

            if (expectedAmount !== payment.amount) {
                throw new Error(
                    "Product price or cart amount has changed. Please contact support."
                );
            }


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
                        "Product stock changed. Please contact support regarding your payment."
                    );
                }
            }

            const orders = await orderSchema.create(
                [{
                    user: req.userId,
                    items: orderItems,
                    totalAmount,
                    shippingAddress,
                    paymentMethod: "ONLINE",
                    paymentStatus: "PAID",
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
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

        return res.status(200).json({
            success: true,
            message: isBuyNow
                ? "Individual online order placed successfully"
                : "Payment successful and order created",
            order: createdOrder,
        });

    } catch (error) {
        console.log("Payment verification error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Payment verification failed",
        });

    } finally {
        if (session) {
            await session.endSession();
        }
    }
};
