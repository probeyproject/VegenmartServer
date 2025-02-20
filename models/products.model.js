import db from "../db/db.js";

// Check if the category, subcategory, and brand exist
export const checkForeignKeys = async (categoryId, subcategoryId, brandId) => {
  try {
    const [category] = await db.query(
      "SELECT category_id FROM categories WHERE category_id = ?",
      [categoryId]
    );
    const [subcategory] = await db.query(
      "SELECT subcategory_id FROM subcategories WHERE subcategory_id = ?",
      [subcategoryId]
    );
    const [brand] = await db.query(
      "SELECT brand_id FROM brands WHERE brand_id = ?",
      [brandId]
    );

    if (!category.length || !subcategory.length || !brand.length) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error validating foreign keys:", error);
    throw new Error("Error validating foreign keys");
  }
};

// Create a new product in the database
export const createProductModal = async (
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
  quantityDiscounts // Accept quantity discounts as an array [{quantityFrom, quantityTo, discountPercentage}]
) => {
  console.log(quantityDiscounts); // Debugging the received quantityDiscounts array

  try {
    // Step 1: Insert Product into database
    const query = `
      INSERT INTO product (
        product_name, product_price, product_details, is_washed, product_description, 
        weight, store_info, unit, refundable, exchangeable, product_image, 
        product_type, tags, manufacturing_date, expiry_date, sku, status, 
        category_id, subcategory_id, brand_id, discount_price, weight_type, 
        stock_type, stock, min_weight, food_preference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
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
      JSON.stringify(imageUrls),
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
    ]);

    const productId = result.insertId;

    // Step 2: Insert quantity-based discounts into the database
    if (quantityDiscounts && quantityDiscounts.length > 0) {
      const discountQuery = `
        INSERT INTO product_quantity_discounts (product_id, min_quantity, max_quantity, discount_percentage)
        VALUES ${quantityDiscounts.map(() => "(?, ?, ?, ?)").join(", ")}
      `;

      const discountValues = quantityDiscounts.flatMap((discount) => [
        productId,
        discount.quantityFrom,
        discount.quantityTo,
        discount.discountPercentage,
      ]);

      await db.query(discountQuery, discountValues);
    }

    // Step 3: Fetch the inserted product and return it
    const [rows] = await db.query(
      `SELECT * FROM product WHERE product_id = ?`,
      [productId]
    );

    return rows[0]; // Return the created product data
  } catch (error) {
    console.log("Error in createProductModal:", error);
    throw new Error(`Error in createProductModal: ${error.message}`);
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const result = await getAllProductModal();

    if (!result || result.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Products are not available",
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

export const getAllProductModal = async () => {
  try {
    const query = `
      SELECT 
        product.product_id, 
        product.product_name, 
        product.product_price,
        product.is_washed,
        product.weight,  
        product.product_image, 
        product.product_type, 
        product.status, 
        product.category_id, 
        product.brand_id,  
        product.discount_price,  
        product.weight_type, 
        product.stock_type, 
        product.stock,
        product.food_preference,
        categories.category_name,
        AVG(reviews.rating) AS average_rating,
        price.price_id,
        price.min_weight,
        price.max_weight,
        price.discount_price AS offer_discount_price
      FROM 
        product
      LEFT JOIN 
        categories ON product.category_id = categories.category_id
      LEFT JOIN 
        subcategories ON product.subcategory_id = subcategories.subcategory_id
      LEFT JOIN 
        brands ON product.brand_id = brands.brand_id
      LEFT JOIN 
        reviews ON product.product_id = reviews.product_id
      LEFT JOIN 
        price ON product.product_id = price.product_id
      GROUP BY 
        product.product_id, 
        categories.category_name, 
        subcategories.subcategory_name, 
        brands.brand_name, 
        price.price_id
      
    `;

    const [result] = await db.query(query);

    // Process the result to group price offers by product
    const products = {};

    result.forEach((row) => {
      // If product is not already in the products object, add it
      if (!products[row.product_id]) {
        products[row.product_id] = {
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          product_details: row.product_details,
          is_washed: row.is_washed,
          product_description: row.product_description,
          weight: row.weight,
          store_info: row.store_info,
          unit: row.unit,
          product_image: row.product_image ? row.product_image : [],
          refundable: row.refundable,
          exchangeable: row.exchangeable,
          product_type: row.product_type,
          tags: row.tags,
          manufacturing_date: row.manufacturing_date,
          expiry_date: row.expiry_date,
          sku: row.sku,
          status: row.status,
          subcategory_id: row.subcategory_id,
          category_id: row.category_id,
          brand_id: row.brand_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          discount_price: row.discount_price,
          food_preference: row.food_preference,
          weight_type: row.weight_type,
          stock_type: row.stock_type,
          stock: row.stock,
          category_name: row.category_name,
          subcategory_name: row.subcategory_name,
          brand_name: row.brand_name,
          average_rating: row.average_rating,
          offers: [], // Initialize offers array
        };
      }

      // Add the offer to the product's offers array
      products[row.product_id].offers.push({
        min_weight: row.min_weight,
        max_weight: row.max_weight,
        discount_price: row.offer_discount_price,
      });
    });

    // Convert products object to an array and return
    return Object.values(products);
  } catch (error) {
    throw new Error(`Error in getAllProductModal: ${error}`);
  }
};

export const getProductByIdModal = async (productId) => {
  try {
    const query = `
      SELECT 
        product.*, 
        categories.category_name, 
        subcategories.subcategory_name, 
        brands.brand_name,
        is_washed,
        AVG(reviews.rating) AS average_rating
      FROM product
      LEFT JOIN categories ON product.category_id = categories.category_id
      LEFT JOIN subcategories ON product.subcategory_id = subcategories.subcategory_id
      LEFT JOIN brands ON product.brand_id = brands.brand_id
      LEFT JOIN reviews ON product.product_id = reviews.product_id
      WHERE product.product_id = ?
      GROUP BY product.product_id, categories.category_name, subcategories.subcategory_name, brands.brand_name`;

    const [result] = await db.query(query, [productId]);

    if (result.length === 0) {
      throw new Error("Product not found");
    }

    const product = result[0];

    // Fetch quantity-based discounts
    const discountQuery = `SELECT min_quantity, max_quantity, discount_price FROM product_quantity_discounts WHERE product_id = ?`;
    const [discounts] = await db.query(discountQuery, [productId]);

    product.quantity_discounts = discounts; // Add quantity discounts to product

    return product;
  } catch (error) {
    throw new Error(`Error in getProductByIdModal: ${error}`);
  }
};

// Get Product by ID
export const getProductByIds = async (productId) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM product WHERE product_id = ?`,
      [productId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error in getProductById:", error);
    throw new Error(`Error retrieving product: ${error.message}`);
  }
};
export const getProductsByCategoryIdModel = async (category_id) => {
  try {
    // Adjust the query to fetch products by categoryId
    const [rows] = await db.query(
      `SELECT * FROM product WHERE category_id = ?`, // Assuming 'category_id' is the field name
      [category_id]
    );
    return rows; // Return all products in the category
  } catch (error) {
    console.error("Error in getProductsByCategoryId:", error);
    throw new Error(`Error retrieving products by category: ${error.message}`);
  }
};

// Update Product
export const updateProductModel = async (
  productId,
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
  quantityDiscounts
) => {
  try {
    const query = `
      UPDATE product SET 
        product_name = ?, product_price = ?, product_details = ?, is_washed = ?, product_description = ?, weight = ?, 
        store_info = ?, unit = ?, refundable = ?, exchangeable = ?, product_image = ?, product_type = ?, 
        tags = ?, manufacturing_date = ?, expiry_date = ?, sku = ?, status = ?, category_id = ?, subcategory_id = ?, 
        brand_id = ?, discount_price = ?, weight_type = ?, stock_type = ?, stock = ?
      WHERE product_id = ?`;

    const productImage = Array.isArray(imageUrls)
      ? JSON.stringify(imageUrls)
      : imageUrls;

    await db.query(query, [
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
      productImage,
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
      productId,
    ]);

    // Delete old quantity discounts
    await db.query(
      `DELETE FROM product_quantity_discounts WHERE product_id = ?`,
      [productId]
    );

    // Insert new quantity discounts
    if (quantityDiscounts && quantityDiscounts.length > 0) {
      const discountQuery = `
        INSERT INTO product_quantity_discounts (product_id, min_quantity, max_quantity, discount_price)
        VALUES ?`;

      const discountValues = quantityDiscounts.map((discount) => [
        productId,
        discount.min,
        discount.max,
        discount.discount,
      ]);

      await db.query(discountQuery, [discountValues]);
    }

    const [rows] = await db.query(
      `SELECT * FROM product WHERE product_id = ?`,
      [productId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error in updateProductModel:", error);
    throw new Error(`Error updating product: ${error.message}`);
  }
};

export const deleteProductByIdModal = async (productId) => {
  try {
    const query = `DELETE FROM product WHERE product_id = ?`;

    const [result] = await db.query(query, [productId]);

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (error) {
    throw new Error(`Error in deleteProductByIdModal  ${error}`);
  }
};

export const getTrendingProductModel = async () => {
  try {
    const query = `
    SELECT p.product_name, p.product_price, p.weight, p.product_image, p.product_id, COUNT(o.product_id) AS order_count
    FROM product p
    LEFT JOIN orders o ON p.product_id = o.product_id
    GROUP BY p.product_id
    ORDER BY order_count DESC
    LIMIT 4`;

    const [result] = await db.query(query);

    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (error) {
    throw new Error(`Error in deleteProductByIdModal  ${error}`);
  }
};

export const getProductCountModal = async () => {
  try {
    const query = `
      SELECT COUNT(*) AS count FROM product
    `;
    const [result] = await db.query(query);
    return result.length === 0 ? null : result[0];
  } catch (error) {
    throw new Error(`Error in getAllProductModal: ${error}`);
  }
};

export const getSimilarProductModel = async (productId) => {
  try {
    // Step 1: Get the product to fetch its category_id and tags
    const [productResult] = await db.query(
      "SELECT category_id, tags FROM product WHERE product_id = ?",
      [productId]
    );

    if (productResult.length === 0) {
      throw new Error("Product not found");
    }

    const category_id = productResult[0].category_id;
    const tags = productResult[0].tags.split(",");

    // Step 2: Find similar products based on category_id or tags
    const [similarProducts] = await db.query(
      `
      SELECT 
        p.product_id,
        p.product_name,
        p.product_price,
        p.weight,
        p.product_image,
        p.product_type,
        p.status,
        p.category_id,
        p.brand_id,
        p.discount_price,
        p.weight_type,
        p.stock_type,
        p.stock,
        p.food_preference,
        cat.category_name,
        AVG(r.rating) AS average_rating,
        pr.price_id,
        pr.min_weight,
        pr.max_weight,
        pr.discount_price AS offer_discount_price
      FROM 
        product p
      JOIN 
        categories cat ON p.category_id = cat.category_id
      LEFT JOIN 
        reviews r ON p.product_id = r.product_id
      LEFT JOIN 
        price pr ON p.product_id = pr.product_id
      WHERE 
        p.product_id != ?
        AND (p.category_id = ? OR FIND_IN_SET(?, p.tags))
      GROUP BY 
        p.product_id, cat.category_name, pr.price_id
      LIMIT 8
    `,
      [productId, category_id, tags[0]]
    );

    // Step 3: Process the result to embed offers and other data inside each product
    const products = {};

    similarProducts.forEach((row) => {
      // If the product is not already in the products object, add it
      if (!products[row.product_id]) {
        products[row.product_id] = {
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          weight: row.weight,
          product_image: row.product_image ? row.product_image : [],
          product_type: row.product_type,
          status: row.status,
          category_id: row.category_id,
          brand_id: row.brand_id,
          discount_price: row.discount_price,
          weight_type: row.weight_type,
          stock_type: row.stock_type,
          stock: row.stock,
          food_preference: row.food_preference,
          category_name: row.category_name,
          average_rating: row.average_rating,
          offers: [], // Initialize offers array
        };
      }

      // Add the offer to the product's offers array
      products[row.product_id].offers.push({
        min_weight: row.min_weight,
        max_weight: row.max_weight,
        discount_price: row.offer_discount_price,
      });
    });

    // Convert products object to an array and return
    return Object.values(products);
  } catch (err) {
    console.log(err);
    throw new Error("Database error: " + err.message);
  }
};

export const freshRegularVegitablesModel = async () => {
  try {
    const query = `
      SELECT 
        product.product_id, 
        product.product_name, 
        product.product_price,  
        product.weight, 
        product.product_image,  
        product.status,
        product.category_id, 
        product.brand_id,  
        product.discount_price, 
        product.weight_type, 
        product.stock_type, 
        product.stock, 
        categories.category_name,
        brands.brand_name,
        AVG(reviews.rating) AS average_rating,
        price.price_id,
        price.min_weight,
        price.max_weight,
        price.discount_price AS offer_discount_price
      FROM 
        product
      LEFT JOIN 
        categories ON product.category_id = categories.category_id
      LEFT JOIN 
        subcategories ON product.subcategory_id = subcategories.subcategory_id
      LEFT JOIN 
        brands ON product.brand_id = brands.brand_id
      LEFT JOIN 
        reviews ON product.product_id = reviews.product_id
      LEFT JOIN 
        price ON product.product_id = price.product_id
      WHERE 
        categories.category_name = 'Fresh Regular Vegetables'  -- Filter by category name
      GROUP BY 
        product.product_id, 
        categories.category_name, 
        subcategories.subcategory_name, 
        brands.brand_name, 
        price.price_id
      LIMIT 20
    `;

    const [result] = await db.query(query);

    // Process the result to group price offers by product
    const products = {};

    result.forEach((row) => {
      // If product is not already in the products object, add it
      if (!products[row.product_id]) {
        products[row.product_id] = {
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          product_details: row.product_details,
          product_description: row.product_description,
          weight: row.weight,
          store_info: row.store_info,
          unit: row.unit,
          product_image: row.product_image ? row.product_image : [],
          refundable: row.refundable,
          exchangeable: row.exchangeable,
          product_type: row.product_type,
          tags: row.tags,
          manufacturing_date: row.manufacturing_date,
          expiry_date: row.expiry_date,
          sku: row.sku,
          status: row.status,
          subcategory_id: row.subcategory_id,
          category_id: row.category_id,
          brand_id: row.brand_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          discount_price: row.discount_price,
          food_preference: row.food_preference,
          weight_type: row.weight_type,
          stock_type: row.stock_type,
          stock: row.stock,
          category_name: row.category_name,
          subcategory_name: row.subcategory_name,
          brand_name: row.brand_name,
          average_rating: row.average_rating,
          offers: [], // Initialize offers array
        };
      }

      // Add the offer to the product's offers array
      products[row.product_id].offers.push({
        min_weight: row.min_weight,
        max_weight: row.max_weight,
        discount_price: row.offer_discount_price,
      });
    });

    // Convert products object to an array and return
    return Object.values(products);
  } catch (error) {
    throw new Error(`Error in getAllProductModal: ${error}`);
  }
};

export const comboVegitablesModel = async () => {
  try {
    const query = `
      SELECT
        product.product_id, 
        product.product_name, 
        product.product_price,  
        product.weight,
        product.product_image,   
        product.discount_price, 
        product.weight_type, 
        product.stock, 
        AVG(reviews.rating) AS average_rating,
        price.min_weight,
        price.max_weight,
        price.discount_price AS offer_discount_price
      FROM 
        product
      LEFT JOIN 
        categories ON product.category_id = categories.category_id
      LEFT JOIN 
        reviews ON product.product_id = reviews.product_id
      LEFT JOIN 
        price ON product.product_id = price.product_id
      WHERE 
        categories.category_name = 'Green Fruit'
      GROUP BY 
        product.product_id, 
        categories.category_name, 
        price.price_id
      LIMIT 8
    `;

    const [result] = await db.query(query);

    // Process the result to group price offers by product
    const products = {};

    result.forEach((row) => {
      // If product is not already in the products object, add it
      if (!products[row.product_id]) {
        products[row.product_id] = {
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          product_details: row.product_details,
          product_description: row.product_description,
          weight: row.weight,
          store_info: row.store_info,
          unit: row.unit,
          product_image: row.product_image ? row.product_image : [],
          refundable: row.refundable,
          exchangeable: row.exchangeable,
          product_type: row.product_type,
          tags: row.tags,
          manufacturing_date: row.manufacturing_date,
          expiry_date: row.expiry_date,
          sku: row.sku,
          status: row.status,
          subcategory_id: row.subcategory_id,
          category_id: row.category_id,
          brand_id: row.brand_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          discount_price: row.discount_price,
          food_preference: row.food_preference,
          weight_type: row.weight_type,
          stock_type: row.stock_type,
          stock: row.stock,
          category_name: row.category_name,
          subcategory_name: row.subcategory_name,
          brand_name: row.brand_name,
          average_rating: row.average_rating,
          offers: [], // Initialize offers array
        };
      }

      // Add the offer to the product's offers array
      products[row.product_id].offers.push({
        min_weight: row.min_weight,
        max_weight: row.max_weight,
        discount_price: row.offer_discount_price,
      });
    });

    // Convert products object to an array and return
    return Object.values(products);
  } catch (error) {
    throw new Error(`Error in getAllProductModal: ${error}`);
  }
};

export const productBannerModel = async () => {
  try {
    const query = `
      SELECT 
        product.product_id, 
        product.product_name, 
        product.product_image
      FROM 
        product
      JOIN 
        categories ON product.category_id = categories.category_id
      WHERE 
        categories.category_name = 'Fresh Regular Vegetables'
      LIMIT 8;
    `;

    // Execute the query with your db connection
    const [result] = await db.query(query);

    // Check if the result is empty and return null if no products are found
    return result.length === 0 ? null : result;
  } catch (error) {
    // Log the error message for better debugging and throw it
    console.error("Error in productBannerModel:", error);
    throw new Error(`Error in productBannerModel: ${error.message}`);
  }
};
