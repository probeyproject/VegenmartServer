import db from "../db/db.js";
import { createWallet } from "./order.model.js";

// Get user by referral code
export const getUserByReferralCode = async (referralCode) => {
  try {
    const query = "SELECT * FROM users WHERE referral_code = ?";
    const [result] = await db.query(query, [referralCode]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.log("Model Error", error);
    throw new Error("Model DB Error");
  }
};

// Create a new user
export const createUser = async (phoneNumber, referralCode) => {
  try {
    const query = "INSERT INTO users (phone, referral_code) VALUES (?, ?)";
    const [result] = await db.query(query, [phoneNumber, referralCode]);

    await createWallet(userId);
    return result.insertId;
  } catch (error) {
    console.log("Model Error", error);
    throw new Error("Model DB Error");
  }
};

// Add reward points to a user's wallet
export const addWalletReward = async (userId, points) => {
  try {
    const query = "INSERT INTO wallets (user_id, points) VALUES (?, ?)";
    const [result] = await db.query(query, [userId, points]);
    return result.insertId; // Return the wallet entry ID
  } catch (error) {
    console.log("Model Error", error);
    throw new Error("Model DB Error");
  }
};

// Get the wallet balance of a user
export const getWalletBalance = async (userId) => {
  try {
    const query =
      "SELECT SUM(points) AS balance FROM wallets WHERE user_id = ?";
    const [result] = await db.query(query, [userId]);
    return result[0].balance || 0;
  } catch (error) {
    console.log("Model Error", error);
    throw new Error("Model DB Error");
  }
};

// Generate and send OTP (without sending response here)
export const sendOtpModel = async (req) => {
  let { phoneNumber } = req.body;

  // Prepend country code if not present
  if (!phoneNumber.startsWith("+91")) {
    phoneNumber = "+91" + phoneNumber;
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

  try {
    // Store OTP in the database
    await db.query(
      "INSERT INTO otps (phone_number, otp, expires_at) VALUES (?, ?, ?)",
      [phoneNumber, otp, expiresAt]
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate OTP");
  }
};

// Get user by referral code Id
// export const getReferralByUserId = async (referralCode) => {
//   try {
//     const query = "SELECT * FROM users WHERE referral_code = ?";
//     const [result] = await db.query(query, [referralCode]);
//     return result.length > 0 ? result[0] : null;
//   } catch (error) {
//     console.log("Model Error", error);
//     throw new Error("Model DB Error");
//   }
// };
