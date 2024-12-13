import express from 'express';
import { addTestimonial, deleteTestimonialById, editTestimonialById, getTestimonialById, getTestimonials } from '../controllers/testimonialModule/testimonial.controller.js';
import upload from '../config/multer.js';


const router = express.Router();

router.post('/testimonial', upload.single('testimonialPic'), addTestimonial);
router.get('/getAllTestimonials', getTestimonials);
router.get('/getTestimonialById/:testimonialId', getTestimonialById);
router.put('/editTestimonialById/:testimonialId',upload.single('testimonialPic'), editTestimonialById);
router.delete('/deleteTestimonialById/:testimonialId', deleteTestimonialById);

export default router;
