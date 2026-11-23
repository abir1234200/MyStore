
import express from "express";

import {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
} from "../controllers/cartController.js";

import { hasToken } from "../middleware/hasToken.js";

const cartRoute = express.Router();

cartRoute.post("/add", hasToken, addToCart);

cartRoute.get("/", hasToken, getCart);

cartRoute.put("/update/:productId", hasToken, updateCartQuantity);

cartRoute.delete("/remove/:productId", hasToken, removeFromCart);

cartRoute.delete("/clear", hasToken, clearCart);

export default cartRoute;
