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

    console.log(userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    // Step 1: Check if user has enough points
    const availablePoints = await getWalletPoints(userId);

    console.log(availablePoints);

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

    // Step 4: Create the order
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

    // Step 5: Update wallet points

    console.log(availablePoints, pointsUsed);

    const updatedPoints = availablePoints - pointsUsed;

    console.log(updatedPoints);

    await updateWalletPoints(userId, updatedPoints);

    const orderId = result.insertId;

    // Automatically create a tracking record for this order
    const trackingData = {
      orderId, // Use the newly created order ID
      status: "Order Confirmed", // Initial status
      location: "Warehouse", // Optional initial location
    };

    await createTrackingModel(trackingData); // Create tracking entry

    // Retrieve the user's phone number
    const userPhone = await getUserPhoneById(userId);
    if (!userPhone) {
      return res.status(400).json({ message: "User phone number not found!" });
    }

    // Send SMS notification to the user
    await sendOrderConfirmationSMS(userPhone, orderId); // Send SMS after order creation

    // Step 6: Clean up cart
    await deleteCartByUserIdModel(userId);

    if (totalPrice >= 500) {
      const newPoints = totalPrice * (10 / 100);
      const balance = await addWalletReward(userId, newPoints);

      console.log(balance);
    }

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
    const { invoiceBase64, orderId } = req.body;

    if (!invoiceBase64 || !orderId) {
      return res
        .status(400)
        .json({ error: "Missing invoiceBase64 or orderId" });
    }

    // Convert Base64 data to a PDF buffer
    const buffer = Buffer.from(invoiceBase64, "base64");
    const fileName = `${orderId}_invoice.pdf`;
    const filePath = path.join("uploads", fileName);

    // Ensure 'uploads' directory exists
    const uploadsDir = path.resolve("uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save the buffer as a local PDF file
    fs.writeFileSync(filePath, buffer);

    // Upload the PDF to Cloudinary
    const uploadedFile = await cloudinary.uploader.upload(filePath, {
      folder: "invoices",
      resource_type: "raw",
    });

    // Delete the local file after successful upload
    fs.unlinkSync(filePath);

    // Save the Cloudinary URL to the database
    await updateOrderInvoice(orderId, uploadedFile.secure_url);

    res.status(200).json({
      message: "Invoice uploaded successfully",
      cloudinary_url: uploadedFile.secure_url,
    });
  } catch (error) {
    console.error("Error uploading invoice:", error);
    res.status(500).json({
      message: "Failed to upload invoice",
      error: error.message,
    });
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
