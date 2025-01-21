import { createBannerModel, deleteBannerByIdModel, editBannerByIdModel, getAllBannerModel, getBannerByIdModel, getBannerForEditByIdModel } from "../../models/banner.model.js";
import cloudinary from 'cloudinary';
import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';

export const createBanner = async (req, res) => {
    try {
        const { bannerName, bannerOffer, bannerOfferTitle, bannerTitle, bannerTitleSmall, bannerDesc, status } = req.body;
        const bannerImage = req.file;

        console.log('body', req.body);
        console.log('file', req.file);

        if (!bannerName || !bannerOffer || !bannerOfferTitle || !bannerTitle || !bannerTitleSmall || !bannerDesc || !status) {
            return res.status(404).json({ message: "All fields are required!" });
        }

        if (!bannerImage) {
            return res.status(404).json({ message: "banner Image is required!" });
        }

        // Compress image
        const image = await Jimp.read(bannerImage.path);
        const compressedImagePath = `compressed_${bannerImage.filename}`;
        await image.quality(60).writeAsync(compressedImagePath);

        // Upload to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(compressedImagePath, {
            folder: 'bannerPage',
        });

        // Get URL from Cloudinary
        const bannerImg = cloudinaryResult.secure_url;
        fs.unlinkSync(compressedImagePath);  // Delete compressed file after upload

        // Call model to insert banner details into the database
        const result = await createBannerModel(
            bannerName,  // Correct order: bannerName first
            bannerOffer,
            bannerOfferTitle,
            bannerImg,   // bannerImg in the correct position
            bannerTitle,
            bannerTitleSmall,
            bannerDesc,
            status
        );

        return res.status(201).json({ message: "Banner created successfully!", result });

    } catch (error) {
        console.log('Banner Controller Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const getAllBanner = async (req, res) => {
    try {
        const result = await getAllBannerModel();

        if(!result) {
            return res.status(404).json({ message : "Banner not present"})
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('Banner Controller Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });  
    }
}

export const getBannerById = async (req, res) => {
    try {
        const { bannerId } = req.params;

        if(!bannerId) {
            return res.status(404).json({ message : "Banner Id is required"})
        }
        const result = await getBannerByIdModel(bannerId);

        if(!result) {
            return res.status(404).json({ message : "Banner is not present"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('Banner Controller Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const editBannerById = async (req, res) => {
    try {
        const { bannerId } = req.params;
        const { bannerName, bannerOffer, bannerOfferTitle, bannerTitle, bannerTitleSmall, bannerDesc, status } = req.body;
        const bannerImg = req.file;

        if (!bannerId) {
            return res.status(404).json({ message: "Banner Id is Required!" });
        }

        // Fetch existing banner details from the database to retain non-updated fields
        const existingBanner = await getBannerForEditByIdModel(bannerId);
        if (!existingBanner) {
            return res.status(404).json({ message: "Banner not found!" });
        }

        // Keep the existing image if no new image is provided
        let bannerImage = existingBanner.banner_image;

        // Check if a new image is uploaded
        if (bannerImg) {
            // Process and upload the new image if provided
            const image = await Jimp.read(bannerImg.path);
            const compressedImagePath = `compressed_${bannerImg.filename}`;
            await image.quality(60).writeAsync(compressedImagePath);

            const cloudinaryResult = await cloudinary.uploader.upload(compressedImagePath, {
                folder: 'bannerPage',
            });

            bannerImage = cloudinaryResult.secure_url; // Update image URL
            fs.unlinkSync(compressedImagePath);
        }

        // Use existing data for fields that are not provided in the request
        const updatedBannerName = bannerName || existingBanner.banner_name;
        const updatedBannerOffer = bannerOffer || existingBanner.banner_offer;
        const updatedBannerOfferTitle = bannerOfferTitle || existingBanner.banner_offer_title;
        const updatedBannerTitle = bannerTitle || existingBanner.banner_title;
        const updatedBannerTitleSmall = bannerTitleSmall || existingBanner.banner_title_small;
        const updatedBannerDesc = bannerDesc || existingBanner.banner_desc;
        const updatedStatus = status || existingBanner.status;

        // Update the database
        const result = await editBannerByIdModel(
            updatedBannerName,
            updatedBannerOffer,
            updatedBannerOfferTitle,
            bannerImage,
            updatedBannerTitle,
            updatedBannerTitleSmall,
            updatedBannerDesc,
            updatedStatus,
            bannerId
        );

        return res.status(200).json({ message: "Banner updated successfully!", result });
    } catch (error) {
        console.log('Banner Controller Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const deleteBannerById = async (req, res) => {
    try {
        const { bannerId } = req.params;

        if(!bannerId) {
            return res.status(404).json({ message : "Banner Id is required"})
        }
        const result = await deleteBannerByIdModel(bannerId);

        if(!result) {
            return res.status(404).json({ message : "Banner is not present"});
        }

        return res.status(200).json({ message : "Banner deleted Successfully!" });
    } catch (error) {
        console.log('Banner Controller Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });  
    }
}