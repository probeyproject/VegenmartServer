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
import { addWalletReward, createUser, getUserByReferralCode, sendOtpModel } from "../../models/signup.model.js";

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
  if (!phoneNumber.startsWith("+91")) {
    phoneNumber = "+91" + phoneNumber;
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

  try {
    // Send OTP via SMS Alert using Axios
    const response = await axios.get("https://www.smsalert.co.in/api/push.json", {
      params: {
        user: process.env.SMS_ALERT_USERNAME, // SMS Alert username
        password: process.env.SMS_ALERT_PASSWORD, // SMS Alert password
        sender: "CVDEMO",
        mobile: phoneNumber,
        text: `Your OTP code is ${otp}.`,
        template_id: "1", 
      },
    });

    if (response.data.status !== "success") {
      throw new Error("Failed to send OTP via SMS Alert");
    }

    // Store OTP in the database
    await db.query(
      "INSERT INTO otps (phone_number, otp, expires_at) VALUES (?, ?, ?)",
      [phoneNumber, otp, expiresAt]
    );

    // Check if the user already exists in the users table
    const [existingUser] = await db.query("SELECT phone FROM users WHERE phone = ?", [
      phoneNumber,
    ]);

    // If user does not exist, create a new user and generate a referral code
    if (existingUser.length === 0) {
      const referralCode = generateReferralCode();
      await db.query(
        "INSERT INTO users (phone, referral_code) VALUES (?, ?)",
        [phoneNumber, referralCode]
      );
    }

    return res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error:error.message });
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
    const [existingUser] = await db.query("SELECT phone FROM users WHERE phone=?", [phoneNumber]);

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
      referralCode: referralCodeForNewUser,  // Provide the new user's referral code
      rewardPoints: 50, // Reward points for new user (could be dynamic)
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong during signup." });
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

  try {
    const [rows] = await db.query("SELECT * FROM otps WHERE phone_number = ?", [phoneNumber]);

    if (rows.length > 0 && otp === rows[0].otp) {
      await db.query("DELETE FROM otps WHERE otp_id = ?", [rows[0].otp_id]);

      const [user] = await db.query("SELECT * FROM users WHERE phone = ?", [phoneNumber]);

      if (user.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      // Fetch all carts and wishlists for the user
      const [cart] = await db.query("SELECT * FROM carts WHERE user_id = ?", [user[0].id]);
      const [wishlist] = await db.query("SELECT * FROM wishlist WHERE user_id = ?", [user[0].id]);

      const token = jwt.sign(
        {
          id: user[0].id,
          email: user[0].email,
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


