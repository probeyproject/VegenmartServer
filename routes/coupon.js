import express from 'express';
import { createCoupon, deleteCouponById, editCouponById, getAllCoupon, getCouponById, validateCoupon } from '../controllers/couponModule/coupon.controller.js';

const router = express.Router();

router.post('/create/coupon', createCoupon);
router.get('/getAllCoupon', getAllCoupon);
router.get('/getCouponById/:couponId', getCouponById);
router.put('/editCouponById/:couponId', editCouponById);
router.delete('/deleteCouponById/:couponId', deleteCouponById);
router.post('/coupons/validate', validateCoupon);


export default router;