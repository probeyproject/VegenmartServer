import express from 'express';
import upload from '../config/multer.js';
import { createCarouselBanner, deleteCarouselBanner, getAllCarouselBanner, getCarouselBannerById, updateCarouselBanner } from '../controllers/carouselBannerModule/carousel_banner.controller.js';


const router = express.Router();

router.post('/carousel-banner', upload.single('carouselBannerPic'), createCarouselBanner);
router.get('/getAllCarouselBanner', getAllCarouselBanner);
router.get('/getCarouselBannerById/:carouselBannerId', getCarouselBannerById);
router.put('/updateCarouselBanner/:carouselBannerId',upload.single('carouselBannerPic'), updateCarouselBanner);
router.delete('/deleteCarouselBanner/:carouselBannerId', deleteCarouselBanner);

export default router;
