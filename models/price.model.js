import db from "../db/db.js";

export const createDiscountRangeModel = async (
  min_weight,
  max_weight,
  discount_price,
  productId
) => {
  try {
    const query =
      "INSERT INTO price (min_weight, max_weight, discount_price, product_id ) VALUES (?, ?, ?, ?) RETURNING *";

    const [result] = await db.query(query, [
      min_weight,
      max_weight,
      discount_price,
      productId,
    ]);

    return result.affectedRows === 0 ? null : result;
  } catch (error) {
    console.log("calculatePriceModel Error", error);
    return { error: "Database error" };
  }
};

// Fetch product price from the product table
export const fetchProductPrice = async (productId) => {
  try {
    const query =
      "SELECT product_price,discount_price, weight_type FROM product WHERE product_id = ?";
    const [result] = await db.query(query, [productId]);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.log("fetchProductPrice Error", error);
    return null;
  }
};

// Fetch the discount range for the given weight from the price table
export const fetchDiscountRange = async (productId, weight) => {
  try {
    // Select the discount range where the weight falls between min_weight and max_weight
    const query =
      "SELECT discount_price FROM price WHERE product_id = ? AND ? BETWEEN min_weight AND max_weight";
    const [result] = await db.query(query, [productId, weight]);

    if (result.length === 0) {
      return null; // No discount found for this weight range
    }

    return result[0]; // Return the discount for this weight range
  } catch (error) {
    console.log("fetchDiscountRange Error", error);
    return null;
  }
};

export const getAllDiscountRangeModel = async () => {
  try {
    const query = `
      SELECT p.product_name, pr.min_weight, pr.max_weight, pr.discount_price
      FROM product p
      INNER JOIN price pr ON p.product_id = pr.product_id
      ORDER BY p.product_name
    `;
    const [result] = await db.query(query);

    if (result.length === 0) {
      return null;
    }

    const groupedResult = result.reduce((acc, item) => {
      const { product_name, min_weight, max_weight, discount_price } = item;
      if (!acc[product_name]) {
        acc[product_name] = [];
      }
      acc[product_name].push({ min_weight, max_weight, discount_price });
      return acc;
    }, {});

    return groupedResult;
  } catch (error) {
    console.log("fetchProductPrice Error", error);
    return null;
  }
};

export const getDiscountRangeByProductIdModel = async (productId) => {
  try {
    const query = "SELECT *  FROM price WHERE product_id = ?";
    const [result] = await db.query(query, [productId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log("fetchProductPrice Error", error);
    return null;
  }
};
