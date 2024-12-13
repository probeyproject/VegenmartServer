import express from 'express';
import { addToWishlist, deleteWishlist, getWishlist } from '../controllers/wishlistModule/wishlist.controller.js';

const router = express.Router();

router.post("/addToWishlist", addToWishlist);
router.get("/getWishlist/:userId", getWishlist);
router.delete("/deleteWishlist", deleteWishlist);

export default router;