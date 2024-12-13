import express from 'express';
import { createHeaderAds, deleteHeaderAdsById, editHeaderAdsByid, getAllHeaderAds, getHeaderAdsById } from '../controllers/headerModule/headerAds.controller.js';

const router = express.Router();

router.post('/create/headerAds', createHeaderAds);
router.get('/getAllHeaderAds', getAllHeaderAds);
router.get('/getHeaderAdsById/:headerAdsId', getHeaderAdsById);
router.put('/editHeaderAdsById/:headerAdsId', editHeaderAdsByid);
router.delete('/deleteHeaderAdsById/:headerAdsId', deleteHeaderAdsById);


export default router;