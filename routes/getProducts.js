import express from 'express';
import { getBestSellers } from '../controllers/getProductsModule/getProducts.controller.js';

const router = express.Router();


router.get('/best-sellers', getBestSellers);

export default router;
