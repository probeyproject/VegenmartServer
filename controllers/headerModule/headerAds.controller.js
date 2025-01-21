import db from "../../db/db.js";
import { createHeaderAdsModel, deleteHeaderAdsByIdModel, editHeaderAdsByIdModel, getAllHeaderAdsModel, getEditForHeaderAdsModel, getHeaderAdsByIdModel } from "../../models/headerAds.model.js";

export const createHeaderAds = async (req, res) => {
    try {
        const {adName,adDescription,adLink,status} = req.body;
        console.log(req.body);
        

        if(!adName || !adDescription || !adLink || !status) {
            return res.status(400).json({message : "All fields are Required!"})
        }

        const result = await createHeaderAdsModel(adName,adDescription,adLink,status);

        if(!result) {
            return res.status(400).json({message : "No Header Ads!"})
        }

        return res.status(201).json({message : "Header Ads Created Successfully!"});
    } catch (error) {
        console.log('Header Ads Controller Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getAllHeaderAds = async (req, res) => {
    try {
        const result = await getAllHeaderAdsModel();

        if(!result) {
            return res.status(400).json({message : "No header ads!"});
        }

        return res.status(200).json(result)
    } catch (error) {
        console.log('Header Ads Controller Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getHeaderAdsById = async (req, res) => {
    try {
        const { headerAdsId } = req.params;

        if(!headerAdsId) {
            return res.status(400).json({message : "Please Provide Header Id or Valid!"});
        }

        const result = await getHeaderAdsByIdModel(headerAdsId);

        if(result.error === "Invalid Id") {
            return res.status(400).json({ message : "Please Provide Valid Header Ads Id" });
        }

        if(!result) {
            return res.status(400).json({message : "No Header Ads!"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('Header Ads Controller Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const editHeaderAdsByid = async (req, res) => {
    try {
        const {headerAdsId} = req.params;
        const {adName,adDescription,adLink,status} = req.body;

        if(!headerAdsId) {
            return res.status(400).json({message : "Please Provide Ads Id or invalid Id"});
        }

        const existingHeaderAds = await getEditForHeaderAdsModel(headerAdsId);
        if(!existingHeaderAds) {
            return res.status(400).json({message : "No data here!"});
        }

        const updateAdName = adName || existingHeaderAds.ad_name;
        const updateAdDescription = adDescription || existingHeaderAds.ad_description;
        const updateAdLink = adLink || existingHeaderAds.ad_link;
        const updateStatus = status || existingHeaderAds.status;

        const result = await editHeaderAdsByIdModel(updateAdName,updateAdDescription,updateAdLink,updateStatus,headerAdsId);
        if(!result) {
            return res.status(400).json({message : "header ads not updated!"});
        }

        return res.status(200).json({message : "Header Ads Updated Successfully!"});
    } catch (error) {
        console.log('Header Ads Controller Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const deleteHeaderAdsById = async (req, res) => {
    try {
        const { headerAdsId } = req.params;

        if(!headerAdsId) {
            return res.status(400).json({message : "Please Provide Header Id or Valid!"});
        }

        const result = await deleteHeaderAdsByIdModel(headerAdsId);

        if(result.error === "Invalid Id") {
            return res.status(400).json({ message : "Please Provide Valid Header Ads Id" });
        }

        if(!result) {
            return res.status(400).json({message : "No Header Ads!"});
        }

        return res.status(200).json({message : "Header Ads Deleted Successfully!"});
    } catch (error) {
        console.log('Header Ads Controller Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}