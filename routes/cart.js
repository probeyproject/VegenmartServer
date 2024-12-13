import express from 'express';
import { createCart, deleteCartById, getAllCart, getAllCartByUserId, getCartById, getRelevantProducts, updateCart } from '../controllers/cartModule/cart.controller.js';

const  router = express.Router();

router.post('/create/cart/:userId', createCart);
router.get('/getCartOrder', getAllCart);
router.get('/getCartById/:cartId', getCartById);
router.get('/getAllCartByUserId/:userId', getAllCartByUserId);
router.put('/cart/:userId/:productId', updateCart);
router.delete('/deleteCartById/:cartId', deleteCartById);
router.get('/relevant-products/:userId', getRelevantProducts);
export default router;