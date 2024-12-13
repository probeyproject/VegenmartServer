import express from 'express';
import { getBannerOffer, getFreshProduct } from '../controllers/getDataForBannerModule/getDataForBanner.controller.js';

const router = express.Router();

router.get('/getOfferBanner/:offerType', getBannerOffer);
router.get('/getAllFreshProduct', getFreshProduct);

export default router;