import db from "../db/db.js";

export const createTrackingModel = async (trackingData) => {
  try {
    const query = `
    INSERT INTO order_tracking (order_id, status, location) 
    VALUES (?, ?, ?)
  `;
    const values = [
      trackingData.orderId,
      trackingData.status,
      trackingData.location,
    ];

    const [result] = await db.query(query, values);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error("Tracking Model Error:", error);
    throw new Error(`Tracking Model DB error ${error.message}`);
  }
};

export const updateTrackingModel = async (trackingId, status, location) => {
   try {
    const query = `
    UPDATE order_tracking 
    SET status = ?, location = ?
    WHERE tracking_id = ?
  `;
  const [result] = await db.query(query, [status,location,trackingId]);
  return result;
   } catch (error) {
    console.error("Tracking Model Error:", error);
    throw new Error(`Tracking Model DB error ${error.message}`);
   }
};

export const getTrackingByOrderIdModel = async (orderId) => {
    try {
      const query = `
      SELECT 
          order_tracking.*,
          addresses.*
      FROM 
          order_tracking 
      JOIN 
          orders ON order_tracking.order_id = orders.order_id 
      JOIN 
          users ON orders.user_id = users.id 
      JOIN 
          addresses ON orders.address_id = addresses.address_id
      WHERE 
          order_tracking.order_id = ?
    `;
    const [rows] = await db.query(query, [orderId]);
    return rows;
    } catch (error) {
      console.error("Tracking Model Error:", error);
      throw new Error(`Tracking Model DB error ${error.message}`);
    }
  };


  export const getOrderModel = async (orderId) => {
    const query = `
        SELECT 
            order_tracking.*, 
            orders.* 
        FROM 
            order_tracking 
        JOIN 
            orders ON order_tracking.order_id = orders.order_id 
        WHERE 
            order_tracking.order_id = ?;
    `;
    const [result] = await db.query(query, [orderId]);
    return result;
};
