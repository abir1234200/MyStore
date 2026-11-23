import express from "express";

import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} from "../controllers/wishlistController.js";

import { hasToken } from "../middleware/hasToken.js";

const wishlistRoute = express.Router();


wishlistRoute.post("/add", hasToken, addToWishlist);


wishlistRoute.get("/", hasToken, getWishlist);


wishlistRoute.delete("/:productId", hasToken, removeFromWishlist);

export default wishlistRoute;