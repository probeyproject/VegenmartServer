import db from "../db/db.js";

export const addToWishlistModel = async (userId, productId) => {
  try {
    // Check if the product already exists in the user's wishlist
    const existWishlistQuery =
      "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?";
    const [existWishlist] = await db.query(existWishlistQuery, [
      userId,
      productId,
    ]);

    if (existWishlist.length > 0) {
      // Product is already in the wishlist
      return { alreadyExists: true };
    }

    const query = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
    const [result] = await db.query(query, [userId, productId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error("Whishlist Model Error:", error);
    throw new Error(`Whishlist Model DB error ${error.message}`);
  }
};

export const getAllWishlistModel = async (userId) => {
  try {
    const query = `
      SELECT 
        wishlist.wishlist_id,
        wishlist.user_id,
        wishlist.product_id,
        product.product_id,
        product.product_name,
        product.product_price,
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
        price.discount_price AS offer_discount_price,
        JSON_ARRAYAGG(
          DISTINCT JSON_OBJECT(
            'quantityFrom', product_quantity_discounts.min_quantity,
            'quantityTo', product_quantity_discounts.max_quantity,
            'discountPercentage', product_quantity_discounts.discount_percentage
          )
        ) AS discountRanges
      FROM 
        wishlist
      LEFT JOIN 
        product ON wishlist.product_id = product.product_id
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
      LEFT JOIN 
        product_quantity_discounts ON product.product_id = product_quantity_discounts.product_id
      WHERE 
        wishlist.user_id = ?
      GROUP BY 
        wishlist.wishlist_id,
        wishlist.user_id,
        wishlist.product_id,
        product.product_id,
        categories.category_name,
        subcategories.subcategory_name,
        brands.brand_name,
        price.price_id
    `;

    const [result] = await db.query(query, [userId]);

    // Process the result to group products and embed wishlist data directly into each product
    const products = {};

    result.forEach((row) => {
      // If product is not already in the products object, add it
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
          subcategory_name: row.subcategory_name,
          brand_name: row.brand_name,
          average_rating: row.average_rating,
          offers: [],
          discountRanges: row.discountRanges
            ? JSON.parse(row.discountRanges)
            : [], // Parse discountRanges
          // Add wishlist data directly into the product object
          wishlist_id: row.wishlist_id,
          wishlist_user_id: row.user_id,
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

    // Convert the products object to an array and return
    return Object.values(products);
  } catch (error) {
    console.error("Wishlist Model Error:", error);
    throw new Error(`Wishlist Model DB error ${error.message}`);
  }
};

export const deleteWishlistModel = async (userId, productId) => {
  try {
    const query = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
    const [result] = await db.query(query, [userId, productId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error("Whishlist Model Error:", error);
    throw new Error(`Whishlist Model DB error ${error.message}`);
  }
};
