import express from 'express';
import { createOrderTracking, getOrder, getOrderTracking, updateOrderTracking } from '../controllers/trackingModule/tracking.controller.js';

const router = express.Router();

router.post('/track', createOrderTracking);
router.put('/trackingById/:trackingId', updateOrderTracking);
router.get('/trackingByOrderId/:orderId', getOrderTracking);
router.get('/odddd/:orderId', getOrder)

export default router;

