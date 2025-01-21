import express from 'express';
import { createProductDetailPageAds, deleteProductDetailPageAdsById, editProductDetailPageAdsById, getAllProductDetailPageAds, getProductDetailPageAdsById } from '../controllers/productDetailPageAdsModule/productDetailPageAds.controller.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/create/Ads', upload.single('logoUrl') , createProductDetailPageAds);
router.get('/getAllAds', getAllProductDetailPageAds);
router.get('/getAdsById/:adsId', getProductDetailPageAdsById);
router.put('/editAdsById/:adsId', upload.single('logoUrl'), editProductDetailPageAdsById);
router.delete('/deleteAdsById/:adsId', deleteProductDetailPageAdsById);


export default router;