import cloudinary from "../../config/cloudinary.js";
import fs from "fs";
import path from "path";
import { signupModel, userExistModel } from "../../models/auth.model.js";
import bcrypt from "bcrypt";
import Jimp from "jimp";
const saltRound = process.env.SALT_ROUND || 10;
import twilio from "twilio";
import dotenv from "dotenv";
import db from "../../db/db.js";
dotenv.config();
import jwt from "jsonwebtoken";
import axios from "axios";

import { OAuth2Client } from "google-auth-library";

import {
  addWalletReward,
  createUser,
  getUserByReferralCode,
  sendOtpModel,
} from "../../models/signup.model.js";
import { createWallet } from "../../models/order.model.js";

export const signUp = async (req, res) => {
  const { firstName, middleName, lastName, email, password, role, phone } =
    req.body;

  const profilePic = req.file;

  if (!firstName || !lastName || !email || !password || !role || !phone) {
    return res.status(400).json({ message: "All fields required" });
  }
  // if (!profilePic) {
  //   return res.status(400).json({ message: "Profile image not uploaded" });
  // }

  try {
    let profileUrl;
    if (profilePic) {
      const profileImagePath = profilePic.path;
      const compressedImagePath = path.join(
        "compressImage",
        `${Date.now()}-compressed.jpg`
      );

      // Compress the image using Jimp
      const image = await Jimp.read(profileImagePath);
      await image
        .resize(256, 100) // Resize to width 800px, auto-adjust height
        .quality(50) // Set JPEG quality to 50%
        .writeAsync(compressedImagePath); // Save the compressed image

      const cloudinaryResult = await cloudinary.uploader.upload(
        compressedImagePath,
        {
          folder: "profile_image",
          public_id: `${Date.now()}-${path.basename(compressedImagePath)}`, // Unique filename
        }
      );

      profileUrl = cloudinaryResult.secure_url;
      // Delete the local original file with a slight delay
      fs.unlinkSync(profileImagePath);
      fs.unlinkSync(compressedImagePath);
    }

    const userExist = await userExistModel(email);
    if (userExist.length === 0) {
      // Hashing password
      const hashPassword = await bcrypt.hash(password, parseInt(saltRound));

      // Inserting user
      await signupModel(
        firstName,
        middleName,
        lastName,
        email,
        hashPassword,
        profileUrl,
        role,
        phone
      );

      const newUser = await userExistModel(email);

      await createWallet(newUser[0].id);

      return res.status(200).json({ message: "User registered" });
    } else {
      return res
        .status(400)
        .json({ message: "User already registered. Try to log in." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// let otpStorage = {};

// // Generate and send OTP
// // export const sendOtp = async (req, res) => {
// //   let { phoneNumber } = req.body;

// //   // Prepend country code if not present
// //   if (!phoneNumber.startsWith("+91")) {
// //     phoneNumber = "+91" + phoneNumber;
// //   }

// //   // Generate a random 6-digit OTP
// //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
// //   const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

// //   try {
// //     // Send OTP via SMS
// //     await client.messages.create({
// //       body: `Your OTP code is ${otp}.`,
// //       from: process.env.TWILIO_PHONE_NUMBER,
// //       to: phoneNumber,
// //     });

// //     // Store OTP in the database
// //     await db.query(
// //       "INSERT INTO otps (phone_number, otp, expires_at) VALUES (?, ?, ?)",
// //       [phoneNumber, otp, expiresAt]
// //     );

// //     const [result] = await db.query("select phone from users where phone=?", [
// //       phoneNumber,
// //     ]);
// //     if (result.length === 0) {
// //       await db.query("insert into users (phone) values (?)", [phoneNumber]);
// //     }

// //     return res.status(200).json({ message: "OTP sent successfully!" });
// //   } catch (error) {
// //     console.log(error);
// //     return res.status(500).json({ error: "Failed to send OTP" });
// //   }
// // };

// // Today Work hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
// // Generate and send OTP with Referral Code generation
// export const sendOtp = async (req, res) => {
//   let { phoneNumber } = req.body;

//   // Prepend country code if not present
//   if (!phoneNumber.startsWith("+91")) {
//     phoneNumber = "+91" + phoneNumber;
//   }

//   // Generate a random 6-digit OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

//   try {
//     // Send OTP via SMS (Use your Twilio or other SMS provider)
//     await client.messages.create({
//       body: `Your OTP code is ${otp}.`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phoneNumber,
//     });

//     // Store OTP in the database
//     await db.query(
//       "INSERT INTO otps (phone_number, otp, expires_at) VALUES (?, ?, ?)",
//       [phoneNumber, otp, expiresAt]
//     );

//     // Check if the user already exists in the users table
//     const [existingUser] = await db.query("select phone from users where phone=?", [
//       phoneNumber,
//     ]);

//     // If user does not exist, create a new user and generate a referral code
//     if (existingUser.length === 0) {
//       // Generate a unique referral code (could be alphanumeric or a combination)
//       const referralCode = generateReferralCode();

//       // Insert new user with phone and referral code
//       await db.query(
//         "INSERT INTO users (phone, referral_code) VALUES (?, ?)",
//         [phoneNumber, referralCode]
//       );
//     }

//     return res.status(200).json({ message: "OTP sent successfully!" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Failed to send OTP" });
//   }
// };

// // Function to generate a unique referral code
// const generateReferralCode = () => {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let referralCode = '';
//   for (let i = 0; i < 6; i++) {
//     const randomIndex = Math.floor(Math.random() * chars.length);
//     referralCode += chars[randomIndex];
//   }
//   return referralCode;
// };

export const sendOtp = async (req, res) => {
  let { phoneNumber } = req.body;

  // Prepend country code if not present
  // Prepend country code if not present
  if (!phoneNumber.startsWith("+91")) {
    phoneNumber = "+91" + phoneNumber;
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

  try {
    const response = await axios.post(
      process.env.SmsApi,
      {
        sender: process.env.Sender, // Use your approved Sender ID from Mtalkz
        to: `${phoneNumber}`, // Include country code
        text: `Your OTP- One Time Password is ${otp} to authenticate your login with Vegenmart .

Powered By Vegenmart`,
        type: "OTP",
        // dltTemplateId: "1107173752437570805", // Required for transactional SMS in India
      },
      {
        headers: {
          "Content-Type": "application/json",
          apiKey: process.env.apikey, // Use your actual API key
        },
      }
    );
    // console.log("SMS Sent Successfully:", response.data);
    if (response.data.message !== "Message Sent Successfully!") {
      throw new Error("Failed to send OTP ");
    }

    // Store OTP in the database
    await db.query(
      "INSERT INTO otps (phone_number, otp, expires_at) VALUES (?, ?, ?)",
      [phoneNumber, otp, expiresAt]
    );

    // Check if the user already exists in the users table
    const [existingUser] = await db.query(
      "SELECT phone FROM users WHERE phone = ?",
      [phoneNumber]
    );

    // If user does not exist, create a new user and generate a referral code
    if (existingUser.length === 0) {
      const referralCode = generateReferralCode();
      await db.query("INSERT INTO users (phone, referral_code) VALUES (?, ?)", [
        phoneNumber,
        referralCode,
      ]);
    }

    return res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error(
      "Error sending SMS:",
      error.response ? error.response.data : error.message
    );
  }
};
// Function to generate a unique referral code
const generateReferralCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let referralCode = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    referralCode += chars[randomIndex];
  }
  return referralCode;
};

// Signup for Referral Token
export const signupUser = async (req, res) => {
  let { phoneNumber, referralCode } = req.body;

  try {
    if (!phoneNumber.startsWith("+91")) {
      phoneNumber = "+91" + phoneNumber;
    }

    // Generate OTP and send it (reuse existing OTP logic)
    await sendOtpModel(req, res);

    // Check if the user already exists in the database
    const [existingUser] = await db.query(
      "SELECT phone FROM users WHERE phone=?",
      [phoneNumber]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists!" });
    }

    // Generate a unique referral code for the new user
    const referralCodeForNewUser = generateReferralCode();

    // Create the new user in the database
    const userId = await createUser(phoneNumber, referralCodeForNewUser);

    // If a referral code was provided, check its validity
    if (referralCode) {
      const referrer = await getUserByReferralCode(referralCode);

      if (referrer) {
        // Award rewards to both the new user and the referrer
        const rewardPoints = 50;
        await addWalletReward(userId, rewardPoints); // Reward for the new user
        await addWalletReward(referrer.id, rewardPoints); // Reward for the referrer
      }
    }

    return res.status(200).json({
      message: "Signup successful!",
      referralCode: referralCodeForNewUser, // Provide the new user's referral code
      rewardPoints: 50, // Reward points for new user (could be dynamic)
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong during signup." });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  let { phoneNumber, otp } = req.body;

  // Prepend country code if not present
  const COUNTRY_CODE = "+91"; // Define a constant for country code
  if (!phoneNumber.startsWith(COUNTRY_CODE)) {
    phoneNumber = COUNTRY_CODE + phoneNumber;
  }
  // console.log(phoneNumber);

  try {
    const [rows] = await db.query(
      "SELECT * FROM otps WHERE phone_number = ? ORDER BY expires_at DESC LIMIT 1",
      [phoneNumber]
    );

    // Delete all OTPs for this phone number after successful verification

    if (rows.length > 0 && otp === rows[0].otp) {
      await db.query("DELETE FROM otps WHERE phone_number = ?", [phoneNumber]);

      const [user] = await db.query("SELECT * FROM users WHERE phone = ?", [
        phoneNumber,
      ]);

      if (user.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      // Fetch all carts and wishlists for the user
      const [cart] = await db.query("SELECT * FROM carts WHERE user_id = ?", [
        user[0].id,
      ]);
      const [wishlist] = await db.query(
        "SELECT * FROM wishlist WHERE user_id = ?",
        [user[0].id]
      );

      const token = jwt.sign(
        {
          userId: user[0].id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1y", // Define constant for token expiration time
        }
      );

      const isRegistered = user[0].isregistered;

      return res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          message: "OTP verified successfully!",
          token,
          user: {
            id: user[0].id,
            first_name: user[0].first_name,
            email: user[0].email,
            phone: user[0].phone,
          },
          register: isRegistered,
          cart: cart.length > 0 ? cart : [], // Return all carts or empty array if none
          wishlists: wishlist.length > 0 ? wishlist : [], // Return all wishlists or empty array if none
        });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};

const client = new OAuth2Client(`${process.env.Google_Client_id}`); // Replace with your Google client ID

export const googleLogin = async (req, res) => {
  const { token } = req.body; // The token from the frontend

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.Google_Client_id, // Ensure the audience matches your Google Client ID
    });

    // Extract the user's information from the ticket
    const payload = ticket.getPayload();

    const { given_name, family_name, email, picture } = payload; // Get the user's name, email, and profile picture

    // Check if the user exists in the database
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log(user);

    if (user.length === 0) {
      // User does not exist, create a new user in the database
      await signupModel(
        given_name, // firstName
        "", // middleName (Google doesn't provide this)
        family_name, // lastName
        email, // email
        "", // password (no password, as this is a Google login)
        picture, // profileUrl (profile picture from Google)
        "user", // role (you can define a default role)
        "" // phone (not available in Google token)
      );

      const newUser = await userExistModel(email);

      await createWallet(newUser[0].id);
    }

    const result = await userExistModel(email);
    // Create a JWT token for the user
    const tokenData = {
      userId: result[0].id,
      email,
      firstName: given_name,
      lastName: family_name,
    };
    const jwtToken = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d", // Set the expiration time for the token
    });

    // Send the JWT token back to the frontend
    return res
      .cookie("token", jwtToken, {})
      .status(200)
      .json({
        message: "Login successful",
        token: jwtToken,
        user: {
          id: result[0].id,
          email: result[0].email,
          role: result[0].role,
          profileImageUrl: result[0].profile_url,
          name: `${result[0].first_name} ${result[0].middle_name} ${result[0].last_name}`,
        },
      });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return res
      .status(500)
      .json({ error: "Failed to authenticate with Google" });
  }
};

export const addUser = async (req, res) => {
  let { phone } = req.body;

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  const COUNTRY_CODE = "+91";
  if (!phone.startsWith(COUNTRY_CODE)) {
    phone = COUNTRY_CODE + phone;
  }

  try {
    // Check if user already exists
    const checkUserSQL = "SELECT id FROM users WHERE phone = ?";

    const [result] = await db.query(checkUserSQL, [phone]);

    if (result.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already exists" });
    }

    const [newUser] = await db.query("INSERT INTO users (phone) VALUES (?)", [
      phone,
    ]);



    return res.status(201).json({
      success: true,
      message: "User added successfully",
      user: { id: newUser.insertId, phone },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};
