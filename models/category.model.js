import db from "../db/db.js";

export const createCategoryModel = async (
  categoryName,
  description,
  categoryUrl,
  status
) => {
  try {
    const query =
      "INSERT INTO categories (category_name, description, category_url, status) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(query, [
      categoryName,
      description,
      categoryUrl,
      status,
    ]);

    return result.length === 0 ? null : result;
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const getAllCategoryModel = async () => {
  try {
    const query =
      "SELECT category_id,category_name,category_url FROM categories";
    const [result] = await db.query(query);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const getCategoryByIdModel = async (categoryId) => {
  try {
    // Query to fetch category products with discount ranges
    const query = `
        SELECT 
          product.product_id, 
          product.product_name, 
          product.product_price,  
          product.weight, 
          product.product_image,  
          product.category_id,  
          product.discount_price, 
          product.weight_type,
          product.stock, 
          AVG(reviews.rating) AS average_rating,
          price.min_weight,
          price.max_weight,
          price.discount_price AS offer_discount_price,
          JSON_ARRAYAGG(
          DISTINCT  JSON_OBJECT(
              'quantityFrom', product_quantity_discounts.min_quantity,
              'quantityTo', product_quantity_discounts.max_quantity,
              'discountPercentage', product_quantity_discounts.discount_percentage
            )
          ) AS discountRanges
        FROM 
          product
        LEFT JOIN 
          categories ON product.category_id = categories.category_id
        LEFT JOIN 
          brands ON product.brand_id = brands.brand_id
        LEFT JOIN 
          reviews ON product.product_id = reviews.product_id
        LEFT JOIN 
          price ON product.product_id = price.product_id
        LEFT JOIN 
          product_quantity_discounts ON product.product_id = product_quantity_discounts.product_id
        WHERE 
          categories.category_id = ?  -- Filter by category_id
        GROUP BY 
          product.product_id, 
          categories.category_name, 
          price.price_id
        LIMIT 15
      `;

    const [result] = await db.query(query, [categoryId]);

    // Process the result to group price offers by product
    const products = {};

    result.forEach((row) => {
      // If product is not already in the products object, add it
      if (!products[row.product_id]) {
        products[row.product_id] = {
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          weight: row.weight,
          product_image: row.product_image ? [row.product_image] : [],
          category_id: row.category_id,
          discount_price: row.discount_price,
          weight_type: row.weight_type,
          stock: row.stock,
          average_rating: row.average_rating,
          offers: [], // Initialize offers array
          discountRanges: row.discountRanges
            ? JSON.parse(row.discountRanges)
            : [], // Parse discountRanges
        };
      }

      // Add the offer to the product's offers array
      if (row.min_weight && row.max_weight) {
        products[row.product_id].offers.push({
          min_weight: row.min_weight,
          max_weight: row.max_weight,
          discount_price: row.offer_discount_price,
        });
      }
    });

    // Convert products object to an array and return
    return Object.values(products);
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const getCategoryBynameModel = async (categoryName) => {
  try {
    // SQL query to fetch products by category name, including category details
    const query = `
        SELECT 
          product.product_id, 
          product.product_name, 
          product.product_price,  
          product.weight, 
          product.product_image,  
          product.category_id,  
          product.discount_price, 
          product.weight_type,
          product.stock, 
          AVG(reviews.rating) AS average_rating,
          price.min_weight,
          price.max_weight,
          price.discount_price AS offer_discount_price,
          categories.category_name,
          JSON_ARRAYAGG(
            DISTINCT JSON_OBJECT(
              'quantityFrom', product_quantity_discounts.min_quantity,
              'quantityTo', product_quantity_discounts.max_quantity,
              'discountPercentage', product_quantity_discounts.discount_percentage
            )
          ) AS discountRanges
        FROM 
          product
        LEFT JOIN 
          categories ON product.category_id = categories.category_id
        LEFT JOIN 
          reviews ON product.product_id = reviews.product_id
        LEFT JOIN 
          price ON product.product_id = price.product_id
        LEFT JOIN 
          product_quantity_discounts ON product.product_id = product_quantity_discounts.product_id
        WHERE 
          categories.category_name = ?  -- Filter by category name
        GROUP BY 
          product.product_id, 
          categories.category_name, 
          price.price_id
        LIMIT 15;
      `;

    // Execute the query using the provided categoryName
    const [result] = await db.query(query, [categoryName]);

    // Process the result to group price offers by product
    const products = {};

    result.forEach((row) => {
      // If product is not already in the products object, add it
      if (!products[row.product_id]) {
        products[row.product_id] = {
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          weight: row.weight,
          product_image: row.product_image ? [row.product_image] : [],
          category_id: row.category_id,
          discount_price: row.discount_price,
          weight_type: row.weight_type,
          stock: row.stock,
          category_name: row.category_name,
          average_rating: row.average_rating,
          offers: [], // Initialize offers array
          discountRanges: row.discountRanges
            ? JSON.parse(row.discountRanges)
            : [], // Parse discountRanges
        };
      }

      // Add the offer to the product's offers array
      if (row.min_weight && row.max_weight) {
        products[row.product_id].offers.push({
          min_weight: row.min_weight,
          max_weight: row.max_weight,
          discount_price: row.offer_discount_price,
        });
      }
    });

    // Convert products object to an array and return
    return Object.values(products);
  } catch (error) {
    console.error("Error in getCategoryByNameModel:", error);
    throw new Error(`Category Model DB error: ${error.message}`);
  }
};

// Edit
export const getCategoryByIdModels = async (categoryId) => {
  try {
    const query = "SELECT * FROM categories WHERE category_id = ?";
    const [rows] = await db.query(query, [categoryId]);
    return rows[0];
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const editCategoryByIdModel = async (
  categoryName,
  description,
  categoryUrl,
  status,
  categoryId
) => {
  try {
    const query =
      "UPDATE categories SET category_name = ?, description = ?, category_url = ?, status = ? WHERE category_id = ?";
    const [result] = await db.query(query, [
      categoryName,
      description,
      categoryUrl,
      status,
      categoryId,
    ]);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const deleteCategoryByIdModel = async (categoryId) => {
  try {
    const query = "DELETE FROM categories WHERE category_id = ?";
    const [result] = await db.query(query, [categoryId]);

    return result.length === 0 ? null : result;
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const getAllProductByCategoryModel = async () => {
  try {
    const query = `
                SELECT p.* 
                FROM product p
                JOIN categories c 
                ON p.category_id = c.category_id
                WHERE c.category_name = 'Combo & Recipes';
        `;

    const [result] = await db.query(query);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error ${error.message}`);
  }
};

export const getProductByCategoryNameModel = async () => {
  try {
    // Simplified SQL query to fetch products only by category (no subcategory)
    const query = `
      WITH RankedProducts AS (
        SELECT p.product_name, product_id, 
               c.category_name,
               ROW_NUMBER() OVER (PARTITION BY c.category_name ORDER BY p.product_id) AS rn
        FROM product p
        JOIN categories c ON p.category_id = c.category_id
        WHERE c.category_name IN ('Leafy Vegetables', 'Mushroom', 'Exotic Vegetables', 'Regular Vegetables','Green Fruit','Citrus Fruit','Tropical Fruit')
      )
      SELECT *
      FROM RankedProducts
      WHERE rn <= 6;
    `;

    // Execute the query
    const [result] = await db.query(query);

    // Transform the result into the desired format by category
    const formattedResult = result.reduce((acc, product) => {
      const { category_name } = product;

      if (!acc[category_name]) {
        acc[category_name] = [];
      }

      acc[category_name].push(product);
      return acc;
    }, {});

    // Return the formatted result or null if no categories found
    return Object.keys(formattedResult).length === 0 ? null : formattedResult;
  } catch (error) {
    console.log(error);
    throw new Error(`Category Model DB error: ${error.message}`);
  }
};
