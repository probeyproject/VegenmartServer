import db from '../db/db.js';

// Fetch best-selling products
export const fetchBestSellersModel = async () => {
  try {
    const query = `
      SELECT p.*, SUM(o.quantity) AS total_sales
      FROM product p
      JOIN orders o ON p.product_id = o.product_id
      GROUP BY p.product_id
      ORDER BY total_sales DESC
      LIMIT 10;
    `;
    const [bestSellers] = await db.query(query);
    return bestSellers;
  } catch (err) {
    throw new Error(err.message);
  }
};



  
