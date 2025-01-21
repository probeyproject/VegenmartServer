import {
  createBusinessModel,
  deleteBusinessByIdModel,
  getAllBusinessModel,
  getBusinessByIdModel,
} from "../../models/business.model.js";

import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import Jimp from "jimp";

export const createBusiness = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, message } = req.body;

    // Validate if images are uploaded
    const businessImages = req.files;
    if (!businessImages || businessImages.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No images uploaded",
      });
    }

    // Process and handle images
    const resizedImages = [];
    for (const file of businessImages) {
      const imageExtension = path.extname(file.originalname).toLowerCase();

      if (imageExtension === ".webp") {
        // For WebP images, no compression is applied
        resizedImages.push(file.path); // Directly push the WebP file path
      } else {
        // For non-WebP images, compress and resize with Jimp
        const image = await Jimp.read(file.path);

        // Resize image to a max width of 1024px (adjust as needed) and maintain aspect ratio
        image.resize(1024, Jimp.AUTO);

        // Compress image to reduce file size (optional: adjust quality to balance size and quality)
        image.quality(80); // Set image quality (lower means more compression)

        // Save the resized and compressed image to a temporary file
        const compressedImagePath = `./temp/${Date.now()}-${file.originalname}`;
        await image.writeAsync(compressedImagePath);

        // Add the compressed image path to the array for upload
        resizedImages.push(compressedImagePath);
      }
    }

    // Upload all images to Cloudinary
    const uploadPromises = resizedImages.map((filePath) =>
      cloudinary.uploader.upload(filePath, {
        folder: "business_images",
        public_id: `${Date.now()}-${path.basename(filePath)}`, // Use path.basename here
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    // Clean up the temporary compressed files locally
    resizedImages.forEach((filePath) => fs.unlinkSync(filePath));

    // Now insert into the database with Cloudinary URLs
    const result = await createBusinessModel(
      firstName,
      lastName,
      email,
      phone,
      address,
      message,
      imageUrls.join(",")
    );

    return res.status(201).json({
      status: "success",
      message: "Business created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating business:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllBusiness = async (req, res) => {
  try {
    const result = await getAllBusinessModel();

    if (result.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log("business error : ", error);
    return res.status(500).json("Internal Server Error");
  }
};

export const getBusinessById = async (req, res) => {
  try {
    const { businesId } = req.params;

    if (!businesId) {
      return res.status(400).json({ message: "Bussiness Id is required!" });
    }

    const result = await getBusinessByIdModel(businesId);

    if (!result) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log("business error : ", error);
    return res.status(500).json("Internal Server Error");
  }
};

export const deleteBusinessById = async (req, res) => {
  try {
    const { businesId } = req.params;

    if (!businesId) {
      return res.status(400).json({ message: "Bussiness Id is required!" });
    }

    const result = await deleteBusinessByIdModel(businesId);

    if (result.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json({ message: "Data deleted Successfully!" });
  } catch (error) {
    console.log("business error : ", error);
    return res.status(500).json("Internal Server Error");
  }
};
