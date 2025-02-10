import db from "../db/db.js";

export const createCartModel = async (
  userId,
  productId,
  combo_id,
  totalPrice,
  quantity,
  cartStatus,
  weight,
  weight_type,
  final_price
) => {
  try {
    // Validate if user exists
    const checkUserQuery = "SELECT * FROM users WHERE id = ?";
    const [userExists] = await db.query(checkUserQuery, [userId]);
    if (userExists.length === 0) {
      return { error: "Invalid userId" };
    }

    // Validate product or combo based on availability
    if (productId) {
      const checkProductQuery = "SELECT * FROM product WHERE product_id = ?";
      const [productExists] = await db.query(checkProductQuery, [productId]);
      if (productExists.length === 0) {
        return { error: "Invalid productId" };
      }
    } else if (combo_id) {
      const checkComboQuery = "SELECT * FROM combos WHERE combo_id = ?";
      const [comboExists] = await db.query(checkComboQuery, [combo_id]);
      if (comboExists.length === 0) {
        return { error: "Invalid combo_id" };
      }
    } else {
      return { error: "Either productId or combo_id must be provided." };
    }

    // Insert into carts table
    const query = `
      INSERT INTO carts 
      (user_id, product_id, combo_id, total_price, quantity, cart_status, weight, weight_type, final_price) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [results] = await db.query(query, [
      userId,
      productId || null, // Use null if productId is not provided
      combo_id || null, // Use null if combo_id is not provided
      totalPrice || 0,
      quantity || 1,
      cartStatus || null,
      weight || 0,
      weight_type || null,
      final_price || 0,
    ]);

    return results.length === 0 ? null : results;
  } catch (error) {
    console.log("CartModel Error", error);
    throw new Error(`CartModel DB error ${error.message}`);
  }
};

export const updateCartModel = async (
  userId,
  productId,
  totalPrice,
  quantity,
  cartStatus,
  weight,
  weight_type
) => {
  try {
    // Check if the user exists
    const checkUserQuery = "SELECT * FROM users WHERE id = ?";
    const [userExists] = await db.query(checkUserQuery, [userId]);
    if (userExists.length === 0) {
      return { error: "Invalid userId" };
    }

    // Check if the product exists
    const checkProductQuery = "SELECT * FROM product WHERE product_id = ?";
    const [productExists] = await db.query(checkProductQuery, [productId]);
    if (productExists.length === 0) {
      return { error: "Invalid productId" };
    }

    // Check if a cart with the given userId and productId exists
    const checkCartQuery =
      "SELECT * FROM carts WHERE user_id = ? AND product_id = ?";
    const [cartExists] = await db.query(checkCartQuery, [userId, productId]);
    if (cartExists.length === 0) {
      return { error: "Cart not found for this user and product" };
    }

    // Update the cart
    const updateQuery = `
      UPDATE carts 
      SET total_price = ?, quantity = ?, cart_status = ?, weight = ?, weight_type = ?
      WHERE user_id = ? AND product_id = ?`;

    const [updateResults] = await db.query(updateQuery, [
      totalPrice,
      quantity,
      cartStatus,
      weight,
      weight_type,
      userId,
      productId,
    ]);

    // Check if update was successful
    if (updateResults.affectedRows > 0) {
      // Fetch the updated cart data
      const selectUpdatedCartQuery =
        "SELECT * FROM carts WHERE user_id = ? AND product_id = ?";
      const [updatedCart] = await db.query(selectUpdatedCartQuery, [
        userId,
        productId,
      ]);

      return { success: true, updatedCart: updatedCart[0] }; // Return the first (and only) updated cart
    } else {
      return { error: "Cart update failed" };
    }
  } catch (error) {
    console.log("CartModel Error", error);
    throw new Error(`CartModel DB error ${error.message}`);
  }
};

export const getAllCartModel = async () => {
  try {
    const query = `
            SELECT 
                carts.cart_id,
                carts.user_id,
                carts.total_price,
                carts.cart_status,
                carts.quantity,
                carts.weight,
                carts.weight_type,
                carts.created_at,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.phone AS user_phone,
                product.product_name AS product_name,
                product.product_price AS product_price,
                product.product_image AS product_image
            FROM 
                carts
            INNER JOIN users ON carts.user_id = users.id
            INNER JOIN product ON carts.product_id = product.product_id
        `;

    const [result] = await db.query(query);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log("CartModel Error", error);
    throw new Error(`CartModel DB error ${error.message}`);
  }
};

export const getCardByIdModel = async (cartId) => {
  try {
    const query = `
        SELECT 
            carts.cart_id,
            carts.total_price,
            carts.cart_status,
            carts.quantity,
            carts.weight,
            carts.weight_type,
            carts.created_at,
            users.first_name AS first_name,
            users.last_name AS last_name,
            users.phone AS user_phone,
            product.product_name AS product_name,
            product.product_price AS product_price,
            product.product_image AS product_image
        FROM 
            carts
        INNER JOIN users ON carts.user_id = users.id
        INNER JOIN product ON carts.product_id = product.product_id
        WHERE cart_id = ?
    `;

    const [result] = await db.query(query, [cartId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log("CartModel Error", error);
    throw new Error(`CartModel DB error ${error.message}`);
  }
};

export const getAllCardByUserIdModel = async (userId) => {
  try {
    const query = `
      SELECT  
        carts.cart_id,
        carts.*, 
        COALESCE(product.product_name, combos.title) AS product_name,
        COALESCE(product.product_image, combos.product_image) AS product_image,
        COALESCE(product.product_price, combos.price) AS product_price,
        COALESCE(carts.weight, 'Kg') AS weight,
        COALESCE(carts.weight_type, '') AS weight_type,
        COALESCE(carts.total_price, 0) AS total_price
      FROM carts
      LEFT JOIN product ON carts.product_id = product.product_id
      LEFT JOIN combos ON carts.combo_id = combos.combo_id
      WHERE carts.user_id = ?`;

    const [result] = await db.query(query, [userId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log("CartModel Error", error);
    throw new Error(`CartModel DB error ${error.message}`);
  }
};

export const deleteCartByIdModel = async (cartId) => {
  try {
    const query = "DELETE FROM carts WHERE cart_id = ?";
    const [result] = await db.query(query, [cartId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log("CartModel Error", error);
    throw new Error(`CartModel DB error ${error.message}`);
  }
};

// Get products from the cart for a specific user
export const getCartProductsByUserId = async (userId) => {
  try {
    const [rows] = await db.query(
      `SELECT c.product_id, cat.category_name 
       FROM carts c 
       JOIN product p ON c.product_id = p.product_id
       JOIN categories cat ON p.category_id = cat.category_id
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows;
  } catch (error) {
    throw new Error("Error fetching cart products: " + error.message);
  }
};

// Get relevant products based on categories
export const getRelatedProducts = async (categories, userId) => {
  try {
    const query = `
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
      LEFT JOIN 
        wishlist w ON p.product_id = w.product_id AND w.user_id = ? 
      WHERE 
        cat.category_name IN (?)
      GROUP BY 
        p.product_id, cat.category_name, pr.price_id
      LIMIT 8
    `;

    const [rows] = await db.query(query, [userId, categories]);

    // Process the results to embed wishlist information directly into each product
    const products = {};

    rows.forEach((row) => {
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
          offers: [],
        };
      }

      // Add the offer to the product's offers array
      products[row.product_id].offers.push({
        min_weight: row.min_weight,
        max_weight: row.max_weight,
        discount_price: row.offer_discount_price,
      });
    });

    // Convert the products object to an array and return
    return Object.values(products);
  } catch (error) {
    throw new Error("Error fetching related products: " + error.message);
  }
};
