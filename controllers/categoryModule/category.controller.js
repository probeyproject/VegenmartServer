import cloudinary from "../../config/cloudinary.js";
import path from 'path';
import fs from 'fs';
import { createCategoryModel, deleteCategoryByIdModel, editCategoryByIdModel, getAllCategoryModel, getAllProductByCategoryModel, getCategoryByIdModel, getCategoryByIdModels, getProductByCategoryNameModel } from "../../models/category.model.js";

export const createCategory = async (req, res) => {
  const { categoryName, description, status } = req.body;
  const categoryImage = req.file;

  if (!categoryImage) {
    return res.status(400).json({ message: "Category Image not Upload" });
  }

  if (!categoryName || !description) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (categoryName.length > 100) {
    return res.status(400).json({ message: "Category name must be less than 100 characters!" });
  }

  try {
    const categoryImagePath = categoryImage.path;

    const cloudinaryResult = await cloudinary.uploader.upload(
      categoryImagePath,
      {
        folder: "profile_images",
        public_id: `${Date.now()}-${path.basename(categoryImagePath)}`,
      }
    );

    const categoryUrl = cloudinaryResult.secure_url;

    // Delete the local processed image filez
    fs.unlinkSync(categoryImagePath);

    const result = await createCategoryModel(categoryName, description, categoryUrl, status);

    return res.status(201).json("Category Created Successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const result = await getAllCategoryModel();

    if(!result) {
        return res.status(400).json({message : "Category is not present"})
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if(!categoryId) {
        return res.status(400).json({message : "categoryId is required!"})
    }

    const result = await getCategoryByIdModel(categoryId); 

    if(!result) {
        return res.status(400).json({message : "Category is not present"})
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const editCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
      return res.status(400).json({ message: "categoryId is required!" });
  }

  const { categoryName, description, status } = req.body;
  const categoryImage = req.file;

  try {
      // Fetch the current category details from the model
      const existingCategory = await getCategoryByIdModels(categoryId);

      if (!existingCategory) {
          return res.status(404).json({ message: "Category not found!" });
      }

      // Use the existing values if they are not provided in the request body
      const updatedCategoryName = categoryName || existingCategory.category_name;
      const updatedDescription = description || existingCategory.description;
      const updatedStatus = status || existingCategory.status;

      // Use the existing image URL by default
      let categoryUrl = existingCategory.category_url;

      // If a new image is uploaded, process it
      if (categoryImage) {
          const categoryImagePath = categoryImage.path;

          // Upload the new image to Cloudinary
          const cloudinaryResult = await cloudinary.uploader.upload(
              categoryImagePath,
              {
                  folder: "profile_images",
                  public_id: `${Date.now()}-${path.basename(categoryImagePath)}`,
              }
          );

          // Get the new image URL
          categoryUrl = cloudinaryResult.secure_url;

          // Delete the local processed image file
          fs.unlinkSync(categoryImagePath);
      }

      const result = await editCategoryByIdModel(
          updatedCategoryName,
          updatedDescription,
          categoryUrl,
          updatedStatus,
          categoryId
      );

      return res.status(201).json("Category updated successfully!");
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const deleteCategoryById = async (req, res) => {
  try {
    const {categoryId} = req.params;

    if(!categoryId) {
        return res.status(400).json({message : "categoryId is required!"})
    }

    const result = await deleteCategoryByIdModel(categoryId);

    if(!result) {
        return res.status(400).json({message : "Category is not present"});
    }

    return res.status(200).json({message : "Category Deleted Successfully!"});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllProductByCategory = async (req, res) => {
  try {
    const result = await getAllProductByCategoryModel();

    if(!result) {
        return res.status(400).json({message : "Product not present for this category at this time!"});
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const getAllProductByCategoryName = async (req, res) => {
  try {
    const result = await getProductByCategoryNameModel();

    if(!result) {
        return res.status(400).json({message : "Product not present for this category at this time!"});
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};