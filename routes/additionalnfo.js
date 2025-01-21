import express from 'express';
import { createAdditionInfo, deleteAdditionInfoById, editAdditionInfoById, getAdditionInfoById, getAllAdditionInfo } from '../controllers/additionalnfoModule/additionInfo.controller.js';

const router = express.Router();

router.post('/create/additionInfo/:categoryId', createAdditionInfo);
router.get('/getAllAdditionInfo', getAllAdditionInfo);
router.get('/getAdditionInfoById/:categoryId', getAdditionInfoById);
router.put('/editAdditionInfoId/:additionalId', editAdditionInfoById);
router.delete('/deleteAdditionInfoById/:additionalId', deleteAdditionInfoById);


export default router;