import express from "express";

import {
    createPaymentOrder,
    verifyPayment,
} from "../controllers/paymentController.js";

import { hasToken } from "../middleware/hasToken.js";

const paymentRoute = express.Router();

paymentRoute.post(
    "/create-order",
    hasToken,
    createPaymentOrder
);

paymentRoute.post(
    "/verify-payment",
    hasToken,
    verifyPayment
);

export default paymentRoute;