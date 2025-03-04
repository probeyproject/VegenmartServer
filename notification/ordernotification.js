// import { client, twilioPhoneNumber } from '../config/twilioConfig.js';
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendOrderConfirmationSMS = async (
  userPhone,
  orderId,
  rewardPoints
) => {

  console.log(userPhone)
 
  try {
    const response = await axios.post(
      process.env.SmsApi,
      {
        sender: process.env.Sender, // Use your approved Sender ID from Mtalkz
        to: `${userPhone}`, // Include country code
        text: `Dear customer,

Your order is confirmed. Kindly check check your account/order section at www.vegenmart.com


Vegenmart- Delivering Ozone Washed Vegetables & Fruits Daily!`,
        type: "Text",
        // dltTemplateId: "1107173752437570805", // Required for transactional SMS in India
      },
      {
        headers: {
          "Content-Type": "application/json",
          apiKey: process.env.apikey, // Use your actual API key
        },
      }
    );

    console.log(response);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};
