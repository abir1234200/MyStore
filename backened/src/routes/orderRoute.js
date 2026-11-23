import express from "express";

import {
    placeOrder,
    getMyOrders,
} from "../controllers/orderController.js";

import { hasToken } from "../middleware/hasToken.js";

const orderRoute = express.Router();

orderRoute.post("/place", hasToken, placeOrder);
orderRoute.get("/my-orders", hasToken, getMyOrders);

export default orderRoute;