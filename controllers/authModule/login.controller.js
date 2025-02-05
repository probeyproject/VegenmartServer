import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { userExistModel } from "../../models/auth.model.js";
import { getUserByIdModel } from "../../models/user.model.js";
import db from "../../db/db.js";

import nodemailer from "nodemailer";

env.config();

const sendResetEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.PASSWORD}`,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
      <p style="color: #555;">Hello,</p>
      <p style="color: #555;">
        We received a request to reset your password. Use the OTP below to proceed with resetting your password.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; color: #007BFF; padding: 10px 20px; border: 2px dashed #007BFF; display: inline-block; border-radius: 5px;">
          ${otp}
        </span>
      </div>
      <p style="color: #555;">
        If you did not request this change, you can ignore this email.
      </p>
      <p style="color: #555;">
        For security reasons, this OTP is valid for only <strong>5 minutes</strong>.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd;">
      <p style="text-align: center; color: #999; font-size: 12px;">
        If you need any help, please contact our support team.<br>
        &copy; ${new Date().getFullYear()} VegenMart. All rights reserved.
      </p>
    </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userExistModel(email);
    if (result.length != 0) {
      const user = result[0];
      const hash = user.password;
      bcrypt.compare(password, hash, function (err, result) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Something wrong in comparing" });
        } else {
          if (result) {
            const token = jwt.sign(
              { userId: user.id, email: user.email, role: user.role },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "1h" }
            );

            // Construct profile image URL if available
            let profileImageUrl = user.profile_url || null;
            delete user.password;
            return res
              .cookie("accessToken", token, {
                httpOnly: true,
              })
              .status(200)
              .json({
                message: "Login successful",
                token,
                user: {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                  profileImageUrl,
                  name: `${user.first_name} ${user.middle_name} ${user.last_name}`,
                },
              });
          } else {
            return res.status(400).json({ message: "Invalid Crediential" });
          }
        }
      });
    } else {
      return res.status(400).json({ message: "User not registered" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);

  try {
    const users = await userExistModel(email);
    const user = users[0];

    if (
      user &&
      user.role === "admin" &&
      (await bcrypt.compare(password, user.password))
    ) {
      // Create a JWT token for admin
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      // Construct profile image URL if available
      let profileImageUrl = user.profile_url || null;
      delete user.password;
      return res
        .cookie("token", token)
        .status(200)
        .json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            profileImageUrl,
            name: `${user.first_name} ${user.middle_name} ${user.last_name}`,
          },
        });
    } else {
      return res.status(400).json({ message: "No access" });
    }
  } catch (error) {
    console.log(err);

    return res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Strict",
    });
    console.log(
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Strict",
      })
    );

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const check = async (req, res) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({ message: "Log in first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decoded.userId;

    const user = await getUserByIdModel(userId);

    if (!user || user.length === 0) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Fetch cart and wishlist data
    const [cart] = await db.query("SELECT * FROM carts WHERE user_id = ?", [
      userId,
    ]);
    const [wishlist] = await db.query(
      "SELECT * FROM wishlist WHERE user_id = ?",
      [userId]
    );
    const [rewards] = await db.query(
      "SELECT points FROM wallets WHERE user_id = ?",
      [userId]
    );

    return res.status(200).json({
      user: {
        id: user[0].id,
        email: user[0].email,
        phone: user[0].phone,
        profileImageUrl: user[0].profile_url,
        name: `${user[0].first_name} ${user[0].middle_name} ${user[0].last_name}`,
        referral_code: user[0].referral_code,
      },
      cart: cart || null, // Returning null if cart is empty
      wishlists: wishlist || null, // Returning null if wishlist is empty
      rewards: rewards || null,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(email);
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if user exists
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save token in database (optional: store in a password_resets table)
    await db.query(
      "INSERT INTO reset_pass_otp (email, otp, expired_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    // Send Email
    const response = sendResetEmail(email, otp);

    res.json(response);
  } catch (error) {
    console.error("Forget password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM reset_pass_otp WHERE email = ? ORDER BY expired_at DESC LIMIT 1",
      [email]
    );

    if (new Date(rows[0].expired_at) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (rows.length > 0 && otp === rows[0].otp) {
      await db.query("DELETE FROM reset_pass_otp WHERE email = ?", [email]);
    }

    res.json({
      success: true,
      message: "OTP verified. You can now reset your password",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.SALT_ROUND || 10)
    );

    // Update password in database
    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      hashPassword,
      email,
    ]);

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
