// import twilio from 'twilio';
// import dotenv from 'dotenv';
// dotenv.config();

// const accountSid = process.env.TWILIO_ACCOUNT_SID;  
// const authToken = process.env.TWILIO_AUTH_TOKEN;    
// const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// export const client = twilio(accountSid, authToken);
// export const twilioPhoneNumber = twilioNumber;

import dotenv from 'dotenv';
dotenv.config();  // Make sure this is the first thing in your file

import twilio from 'twilio';

// // Debugging
// console.log('Twilio Account SID: ', process.env.TWILIO_ACCOUNT_SID);
// console.log('Twilio Auth Token: ', process.env.TWILIO_AUTH_TOKEN);
// console.log('Twilio Phone Number: ', process.env.TWILIO_PHONE_NUMBER);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

export const client = twilio(accountSid, authToken);
export const twilioPhoneNumber = twilioNumber;
