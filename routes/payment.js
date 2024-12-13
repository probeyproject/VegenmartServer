import express from "express";
import { createOrderPayment, verifyPayment } from "../controllers/paymentModule/payment.controller.js";
const router = express.Router();

// Route to create a Razorpay order
router.post('/createOrderPayment', createOrderPayment);

// Route to verify payment after Razorpay response
router.post('/verifyPayment', verifyPayment);

export default router;