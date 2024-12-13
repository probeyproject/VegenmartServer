import express from 'express';
import { createSubcategory, deleteSubcategoryById, editSubcategoryById, filterSubcategoryById, getAllSubcategory, getSubcategoryById } from '../controllers/subcategoryModule/subcategory.controller.js';

const router = express.Router();

router.post('/create/subcategory/:categoryId', createSubcategory);
router.get('/getAllSubcategory', getAllSubcategory);
router.get('/getSubcategoryById/:subcategoryId', getSubcategoryById)
router.put('/editSubcategoryById/:categoryId', editSubcategoryById);
router.delete('/deleteSubcategoryById/:subcategoryId', deleteSubcategoryById);
router.get('/subcategories/:categoryId', filterSubcategoryById);


export default router;

