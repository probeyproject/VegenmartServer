import express from "express";
import { calculatePrice, createDiscountRange, getAllDiscountRange, getDiscountRangeByProductId } from "../controllers/priceModule/price.controller.js";

const router = express.Router();

router.post('/createDiscountRange/:productId', createDiscountRange);
router.post("/calculate-price/:productId", calculatePrice);
router.get('/getAllDiscountRange', getAllDiscountRange);
router.get('/getDiscountRangeByProductId/:productId', getDiscountRangeByProductId)

export default router;
