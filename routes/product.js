import express from "express";
import upload from "../config/multer.js";
import { comboVegitables, createProduct, deleteProductById, editProductById, freshRegularVegitables, getAllProduct, getProductByID, getProductCount, getSimilarProduct, getTrendingProduct, productBanner,getProductsByCategoryId } from "../controllers/productModule/product.controller.js";


const router = express.Router();

router.post('/createProduct', upload.array("productImage"), createProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/getProductById/:productId", getProductByID);
router.get("/getProductbyCategory/:category_id",getProductsByCategoryId)
router.put('/editProductById/:productId', upload.array("productImage"), editProductById);
router.delete('/deleteProductById/:productId', deleteProductById);
router.get('/getTrendingProduct', getTrendingProduct);
router.get('/getProductCount', getProductCount);
router.get('/simillar-product/:productId', getSimilarProduct);
router.get('/fresh-regular-vegitables', freshRegularVegitables);
router.get('/combo-vegitables', comboVegitables);
router.get('/product-banner', productBanner);

export default router;