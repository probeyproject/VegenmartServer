import { createBusinessModel, deleteBusinessByIdModel, getAllBusinessModel, getBusinessByIdModel } from "../../models/business.model.js";

export const createBusiness = async (req, res) => {
    try {
        const {firstName, lastName, email, phone, address, message} = req.body;

        if(!firstName || !lastName || !email || !phone || !address || !message) {
            return res.status(500).json('All fields are (firstName, lastName, email, phone, address, message) required');
        }

        const result = await createBusinessModel(firstName, lastName, email, phone, address, message);

        return res.status(201).json({ message : "Your Information Send Successfully" })
    } catch (error) {
        console.log('business error : ', error);
        return res.status(500).json('Internal Server Error');
    }
}

export const getAllBusiness = async (req, res) => {
    try {
        const result = await getAllBusinessModel();

        if(result.length === 0) {
            return res.status(404).json({ message : "No data found" });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('business error : ', error);
        return res.status(500).json('Internal Server Error');
    }
}

export const getBusinessById = async (req, res) => {
    try {
        const { businesId } = req.params;

        if(!businesId) {
            return res.status(400).json({ message : "Bussiness Id is required!" });
        }

        const result = await getBusinessByIdModel(businesId);

        if(!result) {
            return res.status(404).json({ message : "No data found" });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('business error : ', error);
        return res.status(500).json('Internal Server Error');
    }
}


export const deleteBusinessById = async (req, res) => {
    try {
        const { businesId } = req.params;

        if(!businesId) {
            return res.status(400).json({ message : "Bussiness Id is required!" });
        }

        const result = await deleteBusinessByIdModel(businesId);

        if(result.length === 0) {
            return res.status(404).json({ message : "No data found" });
        }

        return res.status(200).json({ message : "Data deleted Successfully!" });
    } catch (error) {
        console.log('business error : ', error);
        return res.status(500).json('Internal Server Error');
    }
}