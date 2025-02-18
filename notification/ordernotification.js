// import { client, twilioPhoneNumber } from '../config/twilioConfig.js';
import dotenv from "dotenv";
dotenv.config();

export const sendOrderConfirmationSMS = async (
  userPhone,
  orderId,
  rewardPoints
) => {
  const messageBody = `Your order #${orderId} has been successfully placed! Thank you for shopping with us.`;
  const messageRewardPoints = `Your order #${orderId} has been successfully placed! You earned ${rewardPoints} reward points. Thank you for shopping with us.`;

  try {
    await client.messages.create({
      body: messageBody || messageRewardPoints,
      from: twilioPhoneNumber,
      to: userPhone,
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};
