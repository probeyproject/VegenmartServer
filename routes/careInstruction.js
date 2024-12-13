import express from 'express';
import { createCareInstruction, deleteCareInstructionById, editCareInstructionById, getAllCareInstruction, getCareInstructionById } from '../controllers/careInstruction/careInstruction.controller.js';

const router = express.Router();

router.post('/create/careInstruction/:categoryId', createCareInstruction);
router.get('/getAllCareInstruction', getAllCareInstruction);
router.get('/getCareInstructionById/:categoryId', getCareInstructionById);
router.put('/editCareInstructionById/:careId', editCareInstructionById);
router.delete('/deleteCareInstructionById/:careId', deleteCareInstructionById);


export default router;