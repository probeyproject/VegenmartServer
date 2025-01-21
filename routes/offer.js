import express from 'express';
import { createOffer, deleteOfferById, editOfferById, getAllOffer, getOfferById, getOfferByProductId } from '../controllers/offerModule/offer.controller.js';

const router = express.Router();

router.post('/create/offer/:productId', createOffer);
router.get('/getAllOffer', getAllOffer);
router.get('/getOfferById/:offerId', getOfferById);
router.get('/getOfferByProductId/:productId', getOfferByProductId);
router.put('/editOfferById/:offerId', editOfferById);
router.delete('/deleteOfferById/:offerId', deleteOfferById);


export default router;

