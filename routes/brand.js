import express from 'express';
import { createBrand, deleteBrandById, editBrandById, getAllBrand, getBrandById } from '../controllers/brandModule/brand.controller.js';

const router = express.Router();

router.post('/create/brand', createBrand);
router.get('/getAllBrand', getAllBrand);
router.get('/getBrandById/:brandId', getBrandById);
router.put('/editBrandById/:brandId', editBrandById);
router.delete('/deleteBrandById/:brandId', deleteBrandById);

export default router;