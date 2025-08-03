import express from "express";
import {
  initiatePayment,
  verifyPaymentAndCreateOrder,
} from "../controllers/paymentController.js";

import authenticateToken from "../middleware/auth.js";

const paymentRoute = express.Router();

paymentRoute.post("/initiate/payment", authenticateToken, initiatePayment);
paymentRoute.post(
  "/order/create",
  authenticateToken,
  verifyPaymentAndCreateOrder
);

export default paymentRoute;
