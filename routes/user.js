import express from "express";
import {
  deleteUserById,
  editUserById,
  getAllUser,
  getUserById,
  getUserByPhoneNo,
  getUserCount,
} from "../controllers/userModule/user.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/getAllUser", getAllUser);
router.get("/getUserById/:userId", getUserById);
router.put("/editUserById/:userId", upload.single("profilePic"), editUserById);
router.delete("/deleteUserById/:userId", deleteUserById);
router.get("/getUserCount", getUserCount);
router.get("/search-phone", getUserByPhoneNo);

export default router;
