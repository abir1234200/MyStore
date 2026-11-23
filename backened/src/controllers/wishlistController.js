import wishlistSchema from "../models/wishlistSchema.js";
import productSchema from "../models/productSchema.js";


export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

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

        let wishlist = await wishlistSchema.findOne({
            user: req.userId,
        });

        if (!wishlist) {
            wishlist = await wishlistSchema.create({
                user: req.userId,
                products: [productId],
            });
        } else {
            const alreadyExists = wishlist.products.some(
                (id) => id.toString() === productId
            );

            if (alreadyExists) {
                return res.status(400).json({
                    success: false,
                    message: "Product already in wishlist",
                });
            }

            wishlist.products.push(productId);
            await wishlist.save();
        }

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const getWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistSchema.findOne({
            user: req.userId,
        }).populate("products");

        return res.status(200).json({
            success: true,
            wishlist: wishlist || { products: [] },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await wishlistSchema.findOne({
            user: req.userId,
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};