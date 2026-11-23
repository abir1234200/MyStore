
import cartSchema from "../models/cartSchema.js";
import productSchema from "../models/productSchema.js";


export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = Number(quantity);

        if (!productId || !Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID or quantity",
            });
        }

        const product = await productSchema.findOne({
            _id: productId,
            isActive: true,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }


        if (product.seller.toString() === req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot add your own product to cart",
            });
        }

        let cart = await cartSchema.findOne({
            user: req.userId,
        });

        if (!cart) {
            if (qty > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock",
                });
            }

            cart = await cartSchema.create({
                user: req.userId,
                items: [{ product: productId, quantity: qty }],
            });

            return res.status(201).json({
                success: true,
                message: "Product added to cart",
                cart,
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        const newQuantity = existingItem
            ? existingItem.quantity + qty
            : qty;

        if (newQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock",
            });
        }

        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity: qty,
            });
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart,
        });

    } catch (error) {
        console.log("Add to cart error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const getCart = async (req, res) => {
    try {
        const cart = await cartSchema
            .findOne({ user: req.userId })
            .populate("items.product");

        return res.status(200).json({
            success: true,
            cart: cart || { items: [] },
        });

    } catch (error) {
        console.log("Get cart error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const quantity = Number(req.body.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity",
            });
        }

        const product = await productSchema.findOne({
            _id: productId,
            isActive: true,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Only " + product.stock + " items are available",
            });
        }

        const cart = await cartSchema.findOne({
            user: req.userId,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        item.quantity = quantity;

        await cart.save();

        const updatedCart = await cartSchema
            .findById(cart._id)
            .populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: updatedCart,
        });

    } catch (error) {
        console.log("Update cart error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await cartSchema.findOne({
            user: req.userId,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
        });

    } catch (error) {
        console.log("Remove cart error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const clearCart = async (req, res) => {
    try {
        await cartSchema.findOneAndUpdate(
            { user: req.userId },
            { $set: { items: [] } }
        );

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
        });

    } catch (error) {
        console.log("Clear cart error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
