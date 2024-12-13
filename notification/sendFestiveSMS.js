import twilio from 'twilio';
import { client, twilioPhoneNumber } from '../config/twilioConfig.js';
import dotenv from "dotenv";
dotenv.config();

export const sendFestiveSMS = async (userPhone, message) => {
    try {
      await client.messages.create({
        body: message,         
        from: twilioPhoneNumber,
        to: userPhone,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };
