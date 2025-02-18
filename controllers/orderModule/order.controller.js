import {
  addWalletReward,
  createOrderModel,
  deleteCartByUserIdModel,
  deleteOrderByIdModel,
  editOrderByIdModel,
  getAllOrderModel,
  getLatestOrderModel,
  getOrderByIdModel,
  getOrderByUserIdModel,
  getOrderCountModel,
  getProductStockById,
  getUserPhoneById,
  getWalletPoints,
  updateProductStock,
  updateWalletPoints,
  updateOrderInvoice,
} from "../../models/order.model.js";
import { createTrackingModel } from "../../models/tracking.model.js";
import { sendOrderConfirmationSMS } from "../../notification/ordernotification.js";
import db from "../../db/db.js";
// import { updateOrderInvoice } from "../models/order.model.js";
import fs from "fs";
import path from "path";
import cloudinary from "../../config/cloudinary.js";
import { log } from "console";
// import cloudinary from "../../config/cloudinary.js";

// export const createOrder = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { products, totalPrice, cupon, orderStatus, quantity, payment, deliveryDate, deliveryTimeSlot, address_id, payment_mode, pointsUsed, gst_cost, gst_percentage, shipping_cost } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required!" });
//     }

//         // Step 1: Check if user has enough points
//         const availablePoints = await getWalletPoints(userId);

//         if (pointsUsed > availablePoints) {
//           return res.status(400).json({ message: "Not enough points in wallet" });
//         }

//         // Step 2: Calculate final price after applying points
//         const finalPrice = totalPrice - pointsUsed;

//     // Create the order
//     const result = await createOrderModel(
//       JSON.stringify(products),
//       totalPrice,
//       cupon,
//       orderStatus,
//       quantity,
//       payment,
//       userId,
//       deliveryDate,
//       deliveryTimeSlot,
//       address_id,
//       payment_mode,
//       pointsUsed,
//       gst_cost,
//       gst_percentage,
//       shipping_cost
//     );

//     if (!result || !result.insertId) {
//       return res.status(400).json({ message: "Order not created!" });
//     }

//         // Step 4: Update wallet points
//         await updateWalletPoints(userId, pointsUsed);

//        const orderId = result.insertId;

//     // Automatically create a tracking record for this order
//     const trackingData = {
//       orderId,  // Use the newly created order ID
//       status: "Order Confirmed",  // Initial status
//       location: "Warehouse",  // Optional initial location
//     };

//     await createTrackingModel(trackingData);  // Create tracking entry

//     // Retrieve the user's phone number
//     const userPhone = await getUserPhoneById(userId);
//     if (!userPhone) {
//       return res.status(400).json({ message: "User phone number not found!" });
//     }

//     // Send SMS notification to the user
//     await sendOrderConfirmationSMS(userPhone, orderId); // Send SMS after order creation

//     await deleteCartByUserIdModel(userId);

//     return res.status(201).json({
//       message: "Order created successfully and tracking initiated.",
//       orderId,  // Return the order ID
//     });
//   } catch (error) {
//     console.log("CreateOrder Error", error);
//     return res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      products,
      totalPrice,
      cupon,
      orderStatus,
      quantity,
      payment,
      deliveryDate,
      deliveryTimeSlot,
      address_id,
      payment_mode,
      pointsUsed,
      gst_cost,
      gst_percentage,
      shipping_cost,
    } = req.body;

    console.log(cupon);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    // Step 1: Check if user has enough points
    const availablePoints = await getWalletPoints(userId);

    if (pointsUsed > availablePoints) {
      return res.status(400).json({ message: "Not enough points in wallet" });
    }

    // Step 2: Calculate final price after applying points
    const finalPrice = totalPrice - pointsUsed;

    // Step 3: Check and update stock for each product
    for (const product of products) {
      const { id, unit } = product;
      console.log(id, unit);

      // Get the current stock and stock type of the product
      const productStock = await getProductStockById(id);
      if (!productStock) {
        return res
          .status(400)
          .json({ message: `Product with ID ${id} not found` });
      }

      // Check if there is enough stock for the requested quantity (considering weight as well)
      if (productStock.stock < unit) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for product ${id}` });
      }

      // Update the stock after the order
      const newStock = productStock.stock - unit;
      await updateProductStock(id, newStock);
    }

    const orders = await getOrderByUserIdModel(userId);

    const isFirstPurchase = (orders?.length || 0) === 0;

    // Step 4: Update wallet points

    if (isFirstPurchase) await addWalletReward(userId, 100);

    const updatedPoints = availablePoints - pointsUsed;

    await updateWalletPoints(userId, updatedPoints);

    // Retrieve the user's phone number

    // Step 6: Clean up cart
    await deleteCartByUserIdModel(userId);

    if (totalPrice >= 500) {
      const newPoints = totalPrice * (10 / 100);
      const balance = await addWalletReward(userId, newPoints);

      console.log(balance);
    }

    const result = await createOrderModel(
      JSON.stringify(products),
      totalPrice,
      cupon,
      orderStatus,
      quantity,
      payment,
      userId,
      deliveryDate,
      deliveryTimeSlot,
      address_id,
      payment_mode,
      pointsUsed,
      gst_cost,
      gst_percentage,
      shipping_cost
    );

    if (!result || !result.insertId) {
      return res.status(400).json({ message: "Order not created!" });
    }

    const orderId = result.insertId;

    // Automatically create a tracking record for this order
    const trackingData = {
      orderId, // Use the newly created order ID
      status: "Order Confirmed", // Initial status
      location: "Warehouse", // Optional initial location
    };

    await createTrackingModel(trackingData); // Create tracking entry
    const userPhone = await getUserPhoneById(userId);
    if (!userPhone) {
      return res.status(400).json({ message: "User phone number not found!" });
    }

    // Send SMS notification to the user
    await sendOrderConfirmationSMS(userPhone, orderId); // Send SMS after order creation

    return res.status(201).json({
      message: "Order created successfully and tracking initiated.",
      orderId, // Return the order ID
    });
  } catch (error) {
    console.log("CreateOrder Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const uploadInvoice = async (req, res) => {
  try {
    console.log("Received Headers:", req.headers);
    console.log("Received Body:", req.body);
    console.log("Received File:", req.file);

    const { orderId, userId } = req.body;

    if (!req.file || !orderId || !userId) {
      return res
        .status(400)
        .json({ error: "Missing file, orderId, or userId" });
    }

    const filePath = req.file.path;

    // Upload to Cloudinary
    const uploadedFile = await cloudinary.uploader.upload(filePath, {
      folder: "invoices",
      resource_type: "raw",
    });

    fs.unlinkSync(filePath);

    // Save Cloudinary URL to Database
    await updateOrderInvoice(orderId, uploadedFile.secure_url);

    res.status(200).json({
      message: "Invoice uploaded successfully",
      cloudinary_url: uploadedFile.secure_url,
    });
  } catch (error) {
    console.error("Error uploading invoice:", error);
    res
      .status(500)
      .json({ message: "Failed to upload invoice", error: error.message });
  }
};

export const getAllOrder = async (req, res) => {
  try {
    const results = await getAllOrderModel();

    if (!results) {
      return res.status(400).json({ message: "Order is not present" });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res
        .status(400)
        .json({ message: "Please Provide Order Id or Invalid" });
    }

    const orderData = await getOrderByIdModel(orderId);

    if (!orderData) {
      return res.status(400).json({ message: "Order is not Present" });
    }

    return res.status(200).json(orderData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const editOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ message: "Please Provide Order Id or Invalid" });
    }

    if (status !== "Delivered") {
      return res
        .status(400)
        .json({ message: "Only 'Delivered' status can trigger rewards." });
    }

    const results = await editOrderByIdModel(status, orderId);

    if (!results) {
      return res.status(400).json({ message: "Order status update failed." });
    }

    // Get the order details to calculate reward points
    const [orderDetails] = await db.query(
      "SELECT user_id, total_price FROM orders WHERE order_id = ?",
      [orderId]
    );
    if (!orderDetails || !orderDetails[0]) {
      return res.status(400).json({ message: "Order not found." });
    }

    const { user_id, total_price } = orderDetails[0];

    // Calculate the reward points dynamically (e.g., based on order value)
    const rewardPoints = calculateRewardPoints(total_price);

    // Add reward points to the user's wallet
    await addWalletReward(user_id, rewardPoints); // Add points to the user's wallet

    // Retrieve the user's phone number
    const userPhone = await getUserPhoneById(userId);
    if (!userPhone) {
      return res.status(400).json({ message: "User phone number not found!" });
    }

    // Add reward points to the user's wallet
    await sendOrderConfirmationSMS(userPhone, orderId, rewardPoints);

    return res.status(200).json({
      message: `Order delivered successfully. ${rewardPoints} points awarded.`,
      userId: user_id,
      rewardPoints,
    });

    // return res.status(200).json("Order Update Successfully!");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Please Provide User Id or Invalid" });
    }

    const results = await getOrderByUserIdModel(userId);

    if (!results) {
      return res.status(400).json({ message: "User is not Present" });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res
        .status(400)
        .json({ message: "Please Provide Product Id or Invalid" });
    }

    const results = await deleteOrderByIdModel(orderId);

    if (!results) {
      return res.status(400).json({ message: "Order is not Present" });
    }

    return res.status(200).json({ message: "Order deleted Successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getLatestOrder = async (req, res) => {
  try {
    const results = await getLatestOrderModel();

    if (!results) {
      return res.status(400).json({ message: "Order is not present" });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getOrderCount = async (req, res) => {
  try {
    const results = await getOrderCountModel();

    if (!results) {
      return res.status(400).json({ message: "Order is not present" });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// functions
const calculateRewardPoints = (totalPrice) => {
  // Example: 1 point for every 100 INR spent (this can be customized)
  const points = Math.floor(totalPrice / 100); // Round down to the nearest integer
  return points; // You can customize this logic further
};

export const cancelOrderById = async (req, res) => {
  const { orderId } = req.body; // Get the orderId and userId from the request body

  console.log(orderId);

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    // Step 1: Fetch the order details using the order ID
    const orderDetails = await getOrderByIdModel(orderId);

    console.log(orderDetails);

    if (!orderDetails) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Step 2: Check if the order is already cancelled or completed
    if (
      orderDetails.order_status === "Cancelled" ||
      orderDetails.order_status === "Delivered"
    ) {
      return res
        .status(400)
        .json({ error: "Order has already been cancelled or delivered" });
    }

    // Step 3: Update the order status to 'Cancelled'
    await editOrderByIdModel("Cancelled", orderId);

    // Step 4: Update stock levels for the products in the order (if applicable)
    // const products = orderDetails.products; // Assuming you store products as a JSON string in the database
    // for (const product of products) {
    //   const productStock = await getProductStockById(product.id);

    //   console.log(productStock);
    //   if (productStock) {
    //     const newStock = productStock.stock + product.quantity; // Add the product quantity back to stock
    //     await updateProductStock(product.id, newStock); // Update the stock
    //   }
    // }

    // Step 5: Refund points to the user's wallet (if points were used)

    const availablePoints = await getWalletPoints(orderDetails.user_id);

    console.log(availablePoints);

    let refundPoints = orderDetails.points_used || 0; // Default to 0 if no points were used

    // If total price >= 500, deduct 10% of the total price from the refunded points
    if (orderDetails.total_price >= 500) {
      const penaltyPoints = Math.floor(orderDetails.total_price * 0.1); // Calculate 10% penalty
      // refundPoints = Math.max(0, refundPoints - penaltyPoints); // Ensure points don't go negative

      await updateWalletPoints(
        orderDetails.user_id,
        availablePoints - penaltyPoints
      );
    }

    // Step 6: Send a response confirming the cancellation
    return res.status(200).json({
      message: "Order cancelled successfully",
      orderId: orderId,
      newStatus: "Cancelled",
    });
  } catch (error) {
    console.error("Error in cancelOrderController:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while canceling the order" });
  }
};

export const pendingOrderCount = async (req, res) => {
  try {
    const [result] = await db.execute(
      "SELECT COUNT(*) AS count FROM orders WHERE order_status = 'Pending'"
    );

    res.json({ count: result[0].count });
  } catch (error) {
    console.error("Error fetching pending orders count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const pendingOrders = async (req, res) => {
  try {
    const [result] = await db.execute(
      "SELECT order_id, user_id,product, created_at FROM orders WHERE order_status = 'Pending' ORDER BY created_at DESC"
    );

    res.json(result);
  } catch (error) {
    console.error("Error fetching pending orders list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
