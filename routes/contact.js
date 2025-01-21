import express from 'express';
import { createContact, deleteContactById, editContactById, getAllContact, getContactById } from '../controllers/contactModule/contact.controller.js';

const router = express.Router();

router.post('/contact', createContact);
router.get('/getAllContact', getAllContact);
router.get('/getContactById/:contactId', getContactById);
router.put('/editContactById/:contactId', editContactById);
router.delete('/deleteContactById/:contactId', deleteContactById)

export default router;