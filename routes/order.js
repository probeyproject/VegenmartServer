import express from "express";
import {
  cancelOrderById,
  createOrder,
  deleteOrderById,
  editOrderById,
  getAllOrder,
  getLatestOrder,
  getOrderById,
  getOrderByUserId,
  getOrderCount,
  pendingOrderCount,
  pendingOrders,
  uploadInvoice,
} from "../controllers/orderModule/order.controller.js";

import upload from "../config/multer.js";

const router = express.Router();

router.post("/create/order/:userId", createOrder);
router.get("/getAllOrder", getAllOrder);
router.get("/getOrderById/:orderId", getOrderById);
router.get("/getOrderByUserId/:userId", getOrderByUserId);
router.put("/editOrderById/:orderId", editOrderById);
router.delete("/deleteOrderById/:orderId", deleteOrderById);
router.get("/getLatestOrder", getLatestOrder);
router.get("/getOrderCount", getOrderCount);
router.post("/upload-invoice", upload.single("invoice"), uploadInvoice);
router.put("/cancel-order", cancelOrderById);
router.get("/pending-orders-count", pendingOrderCount);
router.get("/pending-orders", pendingOrders);
export default router;
