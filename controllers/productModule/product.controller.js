import path from "path";
import Jimp from "jimp";
import {
  checkForeignKeys,
  comboVegitablesModel,
  createProductModal,
  deleteProductByIdModal,
  freshRegularVegitablesModel,
  getAllProductModal,
  getProductByIdModal,
  getProductByIds,
  getProductCountModal,
  getSimilarProductModel,
  getTrendingProductModel,
  productBannerModel,
  updateProductModel,
  getProductsByCategoryIdModel,
} from "../../models/products.model.js";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";

export const createProduct = async (req, res) => {
  const {
    productName,
    productPrice,
    productDetails,
    is_washed,
    productDescription,
    weight,
    storeInfo,
    unit,
    refundable,
    exchangeable,
    productType,
    tags,
    manufacturingDate,
    expiryDate,
    sku,
    status,
    categoryId,
    subcategoryId,
    brandId,
    discountPrice,
    weightType,
    stockType,
    stock,
    minWeight,
    foodPreference,
    discountRanges,
  } = req.body;

  const productImages = req.files;

  if (!productImages || productImages.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "No images uploaded",
    });
  }

  try {
    // Validate foreign keys (categoryId, subcategoryId, brandId)
    const isValidKeys = await checkForeignKeys(
      categoryId,
      subcategoryId,
      brandId
    );
    if (!isValidKeys) {
      return res.status(400).json({
        status: "error",
        message: "Invalid category, subcategory, or brand",
      });
    }

    // Process and upload images
    const resizedImages = [];
    for (const file of productImages) {
      const imageExtension = path.extname(file.originalname).toLowerCase();
      if (imageExtension === ".webp") {
        resizedImages.push(file.path);
      } else {
        const image = await Jimp.read(file.path);
        image.resize(1024, Jimp.AUTO);
        image.quality(80);
        const compressedImagePath = `./temp/${Date.now()}-${file.originalname}`;
        await image.writeAsync(compressedImagePath);
        resizedImages.push(compressedImagePath);
      }
    }

    const uploadPromises = resizedImages.map((filePath) =>
      cloudinary.uploader.upload(filePath, {
        folder: "product_images",
        public_id: `${Date.now()}-${path.basename(filePath)}`,
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);
    resizedImages.forEach((filePath) => fs.unlinkSync(filePath));

    // Parse discountRanges if it's a string or an array
    let quantityDiscounts = [];
    try {
      if (typeof discountRanges === "string") {
        quantityDiscounts = JSON.parse(discountRanges); // Parse string to array
      } else if (Array.isArray(discountRanges)) {
        quantityDiscounts = discountRanges; // If it's already an array, use it directly
      } else {
        console.warn("Unexpected discountRanges format:", discountRanges);
      }
    } catch (error) {
      console.error("Invalid JSON for discountRanges:", discountRanges);
      return res.status(400).json({
        status: "error",
        message: "Invalid discountRanges format",
      });
    }

    // ✅ Create Product
    const result = await createProductModal(
      productName,
      productPrice,
      productDetails,
      is_washed,
      productDescription,
      weight,
      storeInfo,
      unit,
      refundable,
      exchangeable,
      imageUrls,
      productType,
      tags,
      manufacturingDate,
      expiryDate,
      sku,
      status,
      categoryId,
      subcategoryId,
      brandId,
      discountPrice,
      weightType,
      stockType,
      stock,
      minWeight,
      foodPreference,
      quantityDiscounts
    );

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const result = await getAllProductModal();

    if (!result) {
      return res.send(400).json({
        status: "error",
        message: "Product is not available",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getProductByID = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      return res.status(400).json({
        status: "error",
        message: "productId is Required",
      });
    }

    const result = await getProductByIdModal(productId);

    if (!result) {
      return res.status(400).json({
        status: "error",
        message: "Product is not available",
      });
    }

    return res.status(200).json([result]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
export const getProductsByCategoryId = async (req, res) => {
  try {
    const category_id = req.params.category_id; // Get category ID from request parameters

    if (!category_id) {
      return res.status(400).json({
        status: "error",
        message: "categoryId is Required",
      });
    }

    // Fetch products by categoryId from the database
    const products = await getProductsByCategoryIdModel(category_id); // Replace with your database query

    if (!products || products.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No products found for this category",
      });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Edit Product
export const editProductById = async (req, res) => {
  const {
    productName,
    productPrice,
    productDetails,
    is_washed,
    productDescription,
    weight,
    storeInfo,
    unit,
    refundable,
    exchangeable,
    productType,
    tags,
    manufacturingDate,
    expiryDate,
    sku,
    status,
    categoryId,
    subcategoryId,
    brandId,
    discountPrice,
    weightType,
    stockType,
    stock,
  } = req.body;

  const productId = req.params.productId;

  try {
    // Get the existing product details to keep any field that is not updated
    const existingProduct = await getProductByIds(productId);

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Handle product images
    let imageUrls = existingProduct.product_image;
    const productImages = req.files;

    if (productImages && productImages.length > 0) {
      // Upload new images to Cloudinary
      const uploadPromises = productImages.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "product_images",
          public_id: `${Date.now()}-${file.originalname}`,
        })
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);

      // Clean up uploaded files locally
      const cleanupPromises = productImages.map((file) =>
        fs.unlinkSync(file.path)
      );
      await Promise.all(cleanupPromises);
    }

    // Update product with new values or keep old values if not provided
    const updatedProduct = await updateProductModel(
      productId,
      productName || existingProduct.product_name,
      productPrice || existingProduct.product_price,
      productDetails || existingProduct.product_details,
      is_washed !== undefined ? is_washed : existingProduct.is_washed,
      productDescription || existingProduct.product_description,
      weight || existingProduct.weight,
      storeInfo || existingProduct.store_info,
      unit || existingProduct.unit,
      refundable !== undefined ? refundable : existingProduct.refundable,
      exchangeable !== undefined ? exchangeable : existingProduct.exchangeable,
      imageUrls,
      productType || existingProduct.product_type,
      tags || existingProduct.tags,
      manufacturingDate || existingProduct.manufacturing_date,
      expiryDate || existingProduct.expiry_date,
      sku || existingProduct.sku,
      status || existingProduct.status,
      categoryId || existingProduct.category_id,
      subcategoryId || existingProduct.subcategory_id,
      brandId || existingProduct.brand_id,
      discountPrice || existingProduct.discount_price,
      weightType || existingProduct.weight_type,
      stockType || existingProduct.stock_type,
      stock || existingProduct.stock
    );

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    // console.log("pr2", productId);

    if (!productId) {
      return res.status(400).json({
        status: "error",
        message: "productId is Required",
      });
    }

    const result = await deleteProductByIdModal(productId);

    if (!result) {
      return res.status(400).json({
        status: "error",
        message: "Product is not available",
      });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getTrendingProduct = async (req, res) => {
  try {
    const result = await getTrendingProductModel();

    if (!result) {
      return res.status(400).json({
        status: "error",
        message: "Product is not available",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getProductCount = async (req, res) => {
  try {
    const result = await getProductCountModal();

    if (!result) {
      return res.send(400).json({
        status: "error",
        message: "Product is not available",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getSimilarProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await getSimilarProductModel(productId);

    if (!result) {
      return res.send(400).json({
        status: "error",
        message: "Product is not available",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const freshRegularVegitables = async (req, res) => {
  try {
    const result = await freshRegularVegitablesModel();

    if (!result) {
      return res.send(400).json({
        status: "error",
        message: "Product is not available",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const comboVegitables = async (req, res) => {
  try {
    const result = await comboVegitablesModel();

    if (!result) {
      return res.send(400).json({
        status: "error",
        message: "Product is not available",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const productBanner = async (req, res) => {
  try {
    const result = await productBannerModel();

    if (!result) {
      return res.send(400).json({
        status: "error",
        message: "Product is not available",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
