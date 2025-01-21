import axios from 'axios';
import { createLocationModel, deleteLocationByIdModel, edittLocationByIdModel, getAllLocationModel, getLocationByIdModel, saveLocation } from '../../models/location.model.js';


export const createLocation = async (req, res) => {
    try {
    const { location } = req.body;

    if(!location) {
        return res.status(200).json({ message: 'Location is required!' });
    }

    const result = await createLocationModel(location);

    if(!result) {
        return res.status(200).json({ message: 'Location not created!' });
    }
    return res.status(200).json({ message: 'Location saved successfully!' });
    } catch (err) {
        console.error('Error saving location:', err);
        return res.status(500).json({ error: 'Failed to save location' });
    }
};

export const getAllLocation = async (req, res) => {
    try {
    const result = await getAllLocationModel();

    if(!result) {
        return res.status(200).json({ message: 'Location not found!' });
    }

    return res.status(200).json(result);
    } catch (err) {
        console.error('Error saving location:', err);
        return res.status(500).json({ error: 'Failed to save location' });
    }
};

export const getLocationById = async (req, res) => {
    try {
    const { locationId } = req.params;

    if(!locationId) {
        return res.status(200).json({ message: 'Location Id is required!' });
    }

    const result = await getLocationByIdModel(locationId);

    if(!result) {
        return res.status(200).json({ message: 'Location not found!' });
    }

    return res.status(200).json(result);
    } catch (err) {
        console.error('Error saving location:', err);
        return res.status(500).json({ error: 'Failed to save location' });
    }
};


export const editLocationById = async (req, res) => {
    try {
    const { locationId } = req.params;
    const { location } = req.body;

    if(!locationId) {
        return res.status(200).json({ message: 'Location Id is required!' });
    }

    const result = await edittLocationByIdModel(location,locationId);

    if(!result) {
        return res.status(200).json({ message: 'Location not found!' });
    }

    return res.status(200).json({ message : "Location updated Successfully"});
    } catch (err) {
        console.error('Error saving location:', err);
        return res.status(500).json({ error: 'Failed to save location' });
    }
};


export const deleteLocationById = async (req, res) => {
    try {
    const { locationId } = req.params;

    if(!locationId) {
        return res.status(200).json({ message: 'Location Id is required!' });
    }

    const result = await deleteLocationByIdModel(locationId);

    if(!result) {
        return res.status(200).json({ message: 'Location not found!' });
    }

    return res.status(200).json({ message: 'Location delete Successfully!' });
    } catch (err) {
        console.error('Error saving location:', err);
        return res.status(500).json({ error: 'Failed to save location' });
    }
};




export const saveUserLocation = async (req, res) => {
    const { user_id, latitude, longitude, address } = req.body;

    try {
        await saveLocation(user_id, latitude, longitude, address);
        return res.status(200).json({ message: 'Location saved successfully!' });
    } catch (err) {
        console.error('Error saving location:', err);
        return res.status(500).json({ error: 'Failed to save location' });
    }
};

export const getCurrentLocation = async (req, res) => {
    try {
        const response = await axios.get('https://ipapi.co/json/');
        const { latitude, longitude, city, region } = response.data;
        return res.status(200).json({ latitude, longitude, city, region });
    } catch (err) {
        console.error('Error fetching location:', err);
        return res.status(500).json({ error: 'Failed to fetch current location' });
    }
};
