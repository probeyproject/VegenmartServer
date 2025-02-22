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
        w.wishlist_id,
        w.user_id,
        w.product_id,
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
        p.min_weight,  -- ✅ Fetching min_weight from product table
        c.category_name,
        AVG(r.rating) AS average_rating,
        pr.price_id,
        pr.max_weight,
        pr.discount_price AS offer_discount_price,
        COALESCE(
          JSON_ARRAYAGG(
            DISTINCT JSON_OBJECT(
              'quantityFrom', qd.min_quantity,
              'quantityTo', qd.max_quantity,
              'discountPercentage', qd.discount_percentage
            )
          ),
          JSON_ARRAY()
        ) AS discountRanges
      FROM 
        wishlist w
      LEFT JOIN 
        product p ON w.product_id = p.product_id
      LEFT JOIN 
        categories c ON p.category_id = c.category_id
      LEFT JOIN 
        reviews r ON p.product_id = r.product_id
      LEFT JOIN 
        price pr ON p.product_id = pr.product_id
      LEFT JOIN 
        product_quantity_discounts qd ON p.product_id = qd.product_id
      WHERE 
        w.user_id = ?
      GROUP BY 
        w.wishlist_id,
        p.product_id,
        c.category_name,
        pr.price_id
    `;

    const [result] = await db.query(query, [userId]);

    // Process the result to structure data properly
    const products = {};

    result.forEach((row) => {
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
          min_weight: row.min_weight || 0, // ✅ Ensuring it's always a valid number
          average_rating: row.average_rating,
          offers: [],
          discountRanges: row.discountRanges
            ? JSON.parse(row.discountRanges)
            : [],
          wishlist_id: row.wishlist_id,
          wishlist_user_id: row.user_id,
        };
      }

      // Add offers only if valid
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
