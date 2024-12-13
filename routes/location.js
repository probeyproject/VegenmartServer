import express from 'express';
import { createLocation, deleteLocationById, editLocationById, getAllLocation, getCurrentLocation, getLocationById, saveUserLocation } from '../controllers/locationModule/location.controller.js';

const router = express.Router();


router.post('/location', createLocation);
router.get('/getAllLocation', getAllLocation);
router.get('/getLocationById/:locationId', getLocationById);
router.put('/editLocationById/:locationId', editLocationById);
router.delete('/deleteLocationById/:locationId', deleteLocationById);
router.post('/save-location', saveUserLocation);
router.get('/current-location', getCurrentLocation);

export default router;
