import express from 'express';
import { createBanner, deleteBannerById, editBannerById, getAllBanner, getBannerById } from '../controllers/bannerModule/banner.controller.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/create/banner', upload.single('bannerImage'), createBanner);
router.get('/getAllBanner', getAllBanner);
router.get('/getBannerById/:bannerId', getBannerById);
router.put('/editBannerById/:bannerId', upload.single('bannerImage'), editBannerById);
router.delete('/deleteBannerById/:bannerId', deleteBannerById);

export default router;