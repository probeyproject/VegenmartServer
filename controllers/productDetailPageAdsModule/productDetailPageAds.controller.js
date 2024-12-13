import cloudinary from 'cloudinary';
import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { createProductDetailPageAdsModel, deleteProductDetailPageAdsByIdModel, editProductDetailPageAdsByIdModel, getAllProductDetailPageAdsModel, getEditForDetailPageAdsByIdModel, getProductDetailPageAdsByIdModel } from '../../models/productDetailPageAds.model.js';


export const createProductDetailPageAds = async (req, res) => {
    try {
        const { companyName, rating, companyDetails, address, contact, status } = req.body;
        const logoUrl = req.file;
        
        if (!companyName || !rating || !companyDetails || !address || !contact) {
            return res.status(404).json({ message: "All fields are required!" });
        }

        if (!logoUrl) {
            return res.status(404).json({ message: "Company logo is required!" });
        }

        const image = await Jimp.read(logoUrl.path);
        const compressedImagePath = `compressed_${logoUrl.filename}`;  
        await image.quality(60).writeAsync(compressedImagePath);

        const cloudinaryResult = await cloudinary.uploader.upload(compressedImagePath, {
            folder: 'detailPageAds',
        });

        const adsLogoImg = cloudinaryResult.secure_url;
        fs.unlinkSync(compressedImagePath);
        const result = await createProductDetailPageAdsModel(
            adsLogoImg,
            companyName,
            rating,
            companyDetails,
            address,
            contact,
            status
        );

        return res.status(201).json({ message: "Ad created successfully!", result });

    } catch (error) {
        console.log("ProductDetailPageAds", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const getAllProductDetailPageAds = async (req, res) => {
    try {
        const result = await getAllProductDetailPageAdsModel();

        if(!result) {
            return res.status(500).json({ message: "Ads Not Present at this time" });
        }

        return res.status(200).json(result);

    } catch (error) {
        console.log("ProductDetailPageAds", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getProductDetailPageAdsById = async (req, res) => {
    try {
        const { adsId } = req.params;

        if(!adsId) {
            return res.status(400).json({ message : "Ads Id is Required!"});
        }

        const result = await getProductDetailPageAdsByIdModel(adsId);

        if(!result) {
            return res.status(400).json({ message : "Ads Not Present at this time"});
        }

        return res.status(200).json(result);

    } catch (error) {
        console.log("ProductDetailPageAds", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const editProductDetailPageAdsById = async (req, res) => {
    try {
        const { adsId } = req.params;
        const { companyName, rating, companyDetails, address, contact, status } = req.body;
        const logoUrl = req.file;

        if (!adsId) {
            return res.status(404).json({ message: "ads Id is Required!" });
        }

        // Fetch existing ad details from the database to retain non-updated fields
        const existingAd = await getEditForDetailPageAdsByIdModel(adsId);
        if (!existingAd) {
            return res.status(404).json({ message: "Ad not found!" });
        }

        let adsLogoImg = existingAd.logo_url; // Keep the existing image if no new image is provided

        if (logoUrl) {
            // Process and upload the new image if provided
            const image = await Jimp.read(logoUrl.path);
            const compressedImagePath = `compressed_${logoUrl.filename}`;
            await image.quality(60).writeAsync(compressedImagePath);

            const cloudinaryResult = await cloudinary.uploader.upload(compressedImagePath, {
                folder: 'detailPageAds',
            });

            adsLogoImg = cloudinaryResult.secure_url; // Update image URL
            fs.unlinkSync(compressedImagePath);
        }

        // Use existing data for fields that are not provided in the request
        const updatedCompanyName = companyName || existingAd.company_name;
        const updatedRating = rating || existingAd.rating;
        const updatedCompanyDetails = companyDetails || existingAd.company_details;
        const updatedAddress = address || existingAd.address;
        const updatedContact = contact || existingAd.contact;
        const updatedStatus = status || existingAd.status;

        // Update the database
        const result = await editProductDetailPageAdsByIdModel(
            adsLogoImg,
            updatedCompanyName,
            updatedRating,
            updatedCompanyDetails,
            updatedAddress,
            updatedContact,
            updatedStatus,
            adsId
        );

        return res.status(200).json({ message: "Ad updated successfully!", result });
    } catch (error) {
        console.error("ProductDetailPageAds error", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const deleteProductDetailPageAdsById = async (req, res) => {
    try {
        const { adsId } = req.params;

        if(!adsId) {
            return res.status(400).json({ message : "Ads Id is Required!"});
        }

        const result = await deleteProductDetailPageAdsByIdModel(adsId);

        if(!result) {
            return res.status(400).json({ message : "Ads Not Present at this time"});
        }

        return res.status(200).json({ message : "Ads Deleted Successfully!"});
    } catch (error) {
        console.log("ProductDetailPageAds", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}