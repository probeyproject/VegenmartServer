import db from "../db/db.js";

export const createReviewModel = async (userId, productId, rating, comment) => {
  try {
    const query =
      "INSERT into reviews (user_id,product_id,rating,comment) VALUES (?, ?, ?, ?)";

    const [result] = await db.query(query, [
      userId,
      productId,
      rating,
      comment,
    ]);

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (error) {
    console.error('review Model Error:', error);
    throw new Error(`review Model DB error ${error.message}`);
  }
};

export const getAllReviewModel = async () => {
  try {
    const query = "SELECT * FROM reviews";

    const [result] = await db.query(query);

    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (error) {
    console.error('review Model Error:', error);
    throw new Error(`review Model DB error ${error.message}`);
  }
};

export const getReviewByIdModel = async (reviewId) => {
  try {
    const query = "SELECT * FROM reviews WHERE review_id = ?";

    const [result] = await db.query(query, [reviewId]);

    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (error) {
    console.error('review Model Error:', error);
    throw new Error(`review Model DB error ${error.message}`);
  }
};

export const editReviewByIdModel = async (rating, comment, reviewId) => {
  try {
    const query =
      "UPDATE reviews SET rating = ?, comment = ? WHERE review_id = ?";

    const [result] = await db.query(query, [rating, comment, reviewId]);

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (error) {
    console.error('review Model Error:', error);
    throw new Error(`review Model DB error ${error.message}`);
  }
};

export const deleteReviewByIdModel = async (reviewId) => {
  try {
    const query = "DELETE FROM reviews WHERE review_id = ?";

    const [result] = await db.query(query, [reviewId]);

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (error) {
    console.error('review Model Error:', error);
    throw new Error(`review Model DB error ${error.message}`);
  }
};

export const getAllReviewByProductIdModel = async (productId) => {
  try {
    const query = `SELECT
    r.comment,
    r.rating,
    r.created_at,
    u.name
FROM
    reviews r
JOIN addresses u ON
    r.user_id = u.user_id
JOIN product p ON
    r.product_id = p.product_id
WHERE
    r.product_id = ?`;

    const [result ]= await db.query(query, [productId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error('review Model Error:', error);
    throw new Error(`review Model DB error ${error.message}`);
  }
};
