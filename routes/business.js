import express from 'express';
import { createBusiness, deleteBusinessById, getAllBusiness, getBusinessById } from '../controllers/businessModule/business.controller.js';
import upload from "../config/multer.js";
const router = express.Router();

router.post('/createBusiness',upload.array("product_image"), createBusiness);
router.get('/getAllBusiness', getAllBusiness);
router.get('/getBusinessById/:businesId', getBusinessById);
router.delete('/deleteBusinessById/:businesId', deleteBusinessById);

export default router;