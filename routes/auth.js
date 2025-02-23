import express from "express";
import {
  addUser,
  googleLogin,
  sendOtp,
  signUp,
  signupUser,
  verifyOtp,
} from "../controllers/authModule/signup.controller.js";
import upload from "../config/multer.js";
import {
  adminLogin,
  check,
  forgetPassword,
  login,
  logout,
  resetPassword,
  verifyResetOtp,
} from "../controllers/authModule/login.controller.js";

const router = express.Router();

router.post("/signup", upload.single("profilePic"), signUp);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signupUserForReferaal", signupUser);
router.post("/login", login);
router.get("/check", check);
router.get("/logout", logout);
router.post("/admin/login", adminLogin);
router.post("/google-login", googleLogin);

router.post("/forgot-password", forgetPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

router.post("/add-user", addUser);
// rewards
// router.get('/getRefrelByUserId', getRefrelByUserId);

export default router;
