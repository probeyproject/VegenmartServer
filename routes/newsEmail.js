import express from 'express';
import { createNewsEmail, deleteNewsEmailById, getAllNewsEmail } from '../controllers/newsEmailModule/news_email.controller.js';
const  router = express.Router();

router.post('/create/newsEmail', createNewsEmail);
router.get('/getAllNewsEmail', getAllNewsEmail);
router.delete('/deleteNewsEmailById/:newsId', deleteNewsEmailById);

export default router;