import express from "express";
import {
  createOrder,
  deleteOrderById,
  editOrderById, 
  getAllOrder,
  getLatestOrder,
  getOrderById,
  getOrderByUserId,
  getOrderCount,
} from "../controllers/orderModule/order.controller.js";

const router = express.Router();

router.post("/create/order/:userId", createOrder);
router.get("/getAllOrder", getAllOrder);
router.get("/getOrderById/:orderId", getOrderById);
router.get("/getOrderByUserId/:userId", getOrderByUserId);
router.put("/editOrderById/:orderId", editOrderById);
router.delete("/deleteOrderById/:orderId", deleteOrderById);
router.get('/getLatestOrder', getLatestOrder);
router.get('/getOrderCount', getOrderCount);

export default router;
