import express from 'express';
import upload from '../config/multer.js';
import { deleteVideoById, editVideoById, getAllVideo, getVideoById, uploadVideo } from '../controllers/videoModule/video.controller.js';

const router = express.Router();

router.post('/upload-video', upload.single('video'), uploadVideo);
router.get('/getAllVideo', getAllVideo)
router.get('/getVideoById/:videoId', getVideoById);
router.put('/editVideoById/:id', upload.single('video'), editVideoById);
router.delete('/deleteVideoById/:videoId', deleteVideoById);

export default router;

