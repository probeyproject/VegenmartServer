import express from 'express';
import { getAllProductByFilter, searchProducts } from '../controllers/filterModule/filter.controller.js';

const router = express.Router();

router.get('/getAllProductByFilter', getAllProductByFilter);
router.get('/search', searchProducts);

export default router;