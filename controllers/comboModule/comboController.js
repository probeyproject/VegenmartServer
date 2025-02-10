import {
  createcombo,
  getAllCombos,
  getComboById,
  updateCombo,
  deleteCombo,
  getParentComboById,
} from "../../models/comboModel.js";

import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import Jimp from "jimp";
// Ensure Cloudinary is configured

//  import { createcombo } from '../models/comboModel.js';

export const createModel = async (req, res) => {
  try {
    const { price, title, description, products } = req.body;

    // Validate required fields
    if (!price || !title || !description || !products || !products.length) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const uploadedFiles = req.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: "No images uploaded!" });
    }

    // Process and handle images
    const processedImages = [];
    for (const file of uploadedFiles) {
      const fileExtension = path.extname(file.originalname).toLowerCase();

      if (fileExtension === ".webp") {
        // Directly use WebP images without processing
        processedImages.push(file.path);
      } else {
        // Resize and compress images using Jimp
        const image = await Jimp.read(file.path);

        // Resize to a max width of 1024px while maintaining aspect ratio
        image.resize(1024, Jimp.AUTO);

        // Set image quality to 80% for compression
        image.quality(80);

        // Save the processed image to a temporary file
        const processedImagePath = `./temp/${Date.now()}-${file.originalname}`;
        await image.writeAsync(processedImagePath);

        processedImages.push(processedImagePath);
      }
    }

    // Upload processed images to Cloudinary
    const uploadPromises = processedImages.map((filePath) =>
      cloudinary.v2.uploader.upload(filePath, {
        folder: "combo_images",
        public_id: `${Date.now()}-${path.basename(filePath)}`,
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    // Clean up temporary files
    processedImages.forEach((filePath) => fs.unlinkSync(filePath));

    // Save combo and products to the database
    const result = await createcombo(
      {
        price,
        title,
        description,
        product_image: JSON.stringify(imageUrls),
      },
      products
    );

    if (!result) {
      return res.status(500).json({ message: "Failed to add combo!" });
    }

    res.status(200).json({
      message: "Combo added successfully!",
      data: result,
    });
  } catch (error) {
    console.error("Error adding combo:", error);
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

export const getParentCombosController = async (req, res) => {
  const { id } = req.params; // Get the id from the URL params

  try {
    const combos = await getParentComboById(id); // Pass the id to the function

    console.log(combos);

    if (!combos || combos.length === 0) {
      return res.status(404).json({ message: "Combo not found!" }); // Return a 404 if no combo is found
    }

    return res.status(200).json(combos); // Return the combo data
  } catch (error) {
    console.error("Error fetching combos:", error.message);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};
export const getComboByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const combo = await getComboById(id);

    if (!combo) {
      return res.status(404).json({ Message: "Combo not found!" });
    }

    return res.status(200).json(combo);
  } catch (error) {
    console.error("Error fetching combo:", error.message);
    return res
      .status(500)
      .json({ Message: `Internal server error: ${error.message}` });
  }
};
export const getAllCombosController = async (req, res) => {
  try {
    const combos = await getAllCombos();
    return res.status(200).json(combos);
  } catch (error) {
    console.error("Error fetching combos:", error.message);
    return res
      .status(500)
      .json({ Message: `Internal server error: ${error.message}` });
  }
};

export const updateComboController = async (req, res) => {
  const { id } = req.params;
  const { product_id, price, title, description } = req.body;

  // Validate required fields
  if (!product_id || !price || !title || !description) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // Check if images are uploaded
    const uploadedFiles = req.files;
    let imageUrls = [];

    if (uploadedFiles && uploadedFiles.length > 0) {
      const processedImages = [];
      for (const file of uploadedFiles) {
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (fileExtension === ".webp") {
          // Directly use WebP images without processing
          processedImages.push(file.path);
        } else {
          // Resize and compress images using Jimp
          const image = await Jimp.read(file.path);

          // Resize to a max width of 1024px while maintaining aspect ratio
          image.resize(1024, Jimp.AUTO);

          // Set image quality to 80% for compression
          image.quality(80);

          // Save the processed image to a temporary file
          const processedImagePath = `./temp/${Date.now()}-${
            file.originalname
          }`;
          await image.writeAsync(processedImagePath);

          processedImages.push(processedImagePath);
        }
      }

      // Upload processed images to Cloudinary
      const uploadPromises = processedImages.map((filePath) =>
        cloudinary.uploader.upload(filePath, {
          folder: "combo_images",
          public_id: `${Date.now()}-${path.basename(filePath)}`,
        })
      );

      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);

      // Clean up temporary files
      processedImages.forEach((filePath) => fs.unlinkSync(filePath));
    }

    // Update combo in the database
    const success = await updateCombo(
      id,
      product_id,
      price,
      title,
      imageUrls.join(","),
      description
    );

    if (!success) {
      return res
        .status(404)
        .json({ message: "Combo not found or update failed!" });
    }

    return res.status(200).json({ message: "Combo updated successfully!" });
  } catch (error) {
    console.error("Error updating combo:", error.message);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

export const deleteComboController = async (req, res) => {
  const { id } = req.params;

  try {
    const success = await deleteCombo(id);

    if (!success) {
      return res
        .status(404)
        .json({ Message: "Combo not found or deletion failed!" });
    }

    return res.status(200).json({ Message: "Combo deleted successfully!" });
  } catch (error) {
    console.error("Error deleting combo:", error.message);
    return res
      .status(500)
      .json({ Message: `Internal server error: ${error.message}` });
  }
};
