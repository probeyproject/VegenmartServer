import { createTrackingModel, getOrderModel, getTrackingByOrderIdModel, updateTrackingModel } from "../../models/tracking.model.js";
import db from "../../db/db.js";


export const createOrderTracking = async (req, res) => {
  try {
    const { orderId, status, location } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: 'Order ID and status are required' });
    }

    const trackingData = { orderId, status, location };
    await createTrackingModel(trackingData);

    return res.status(201).json({ message: 'Tracking created successfully' });
  } catch (error) {
    console.error('createOrderTracking Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const updateOrderTracking = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const { status, location } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    await updateTrackingModel(trackingId, status, location);

    return res.status(200).json({ message: 'Tracking updated successfully' });
  } catch (error) {
    console.error('updateOrderTracking Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Fetch the order details, including product data, from the orders table
    const orderQuery = `
      SELECT *
      FROM orders 
      WHERE order_id = ?
    `;
    const [orderResult] = await db.query(orderQuery, [orderId]);

    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderData = orderResult[0];
    const products = JSON.parse(orderData.product);  // Parse product JSON string

    // Fetch tracking info from order_tracking table
    const tracking = await getTrackingByOrderIdModel(orderId);
    if (tracking.length === 0) {
      return res.status(404).json({ message: 'No tracking info found for this order' });
    }

    // Combine product details and tracking information
    const response = {
      orderId: orderData.order_id,
      totalPrice: orderData.total_price,
      orderStatus: orderData.order_status,
      paymentMode: orderData.payment_mode,
      products,  // Include product details here
      tracking: tracking[0]  // Assuming 1 tracking record for now
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('getOrderTracking Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getOrder = async (req, res) => {
  const { orderId } = req.params;
  const result = await getOrderModel(orderId);

  // If there are no results, return a 404 response
  if (result.length === 0) {
      return res.status(404).json({ message: "Order not found" });
  }

  // Destructure the result
  const orderData = result[0]; // Assuming each order_id returns a single order

  // Structure the response
  const response = {
      orders: {
          order_id: orderData.order_id,
          address_id: orderData.address_id,
          user_id : orderData.user_id
      },
      tracking: {
          tracking_id: orderData.tracking_id,
          status: orderData.status,
          location : orderData.location,
          updated_at: orderData.updated_at,

      },
  };

  return res.status(200).json(response);
};

