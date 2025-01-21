import { getAllUsersModel, getUserByIdModel, editUserByIdModel, deleteUserByIdModal, getUserCountModel } from "../../models/user.model.js";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";
import path from "path";
import Jimp from "jimp";



export const getAllUser = async (req, res) => {
  try {
    const result = await getAllUsersModel();

    if (!result) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const getUserById = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User Id not received" });
  }

  try {
    const result = await getUserByIdModel(userId);

    if (!result) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const editUserById = async (req, res) => {
    const  userId  = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: "User Id is Required!" });
    }

    const { firstName, middleName, lastName, email, phone } = req.body;
    
    const profilePic = req.file;
    let profileUrl;

    try {
        if (profilePic) {
            const profileImagePath = profilePic.path;
            console.log('profileImagePath', profileImagePath);
            const compressedImagePath = path.join("compressImage", `${Date.now()}-compressed.jpg`);
            console.log('compressedImagePath', compressedImagePath);

            // Compress the image using Jimp
            const image = await Jimp.read(profileImagePath);
            await image
                .resize(256, 100) // Resize to width 256px, auto-adjust height
                .quality(50) // Set JPEG quality to 50%
                .writeAsync(compressedImagePath); // Save the compressed image
                // console.log('image', image);

            // Upload to Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(compressedImagePath, {
                folder: "profile_image",
                public_id: `${Date.now()}-${path.basename(compressedImagePath)}`, // Unique filename
            });
            // console.log('cloudinaryResult', cloudinaryResult);

            profileUrl = cloudinaryResult.secure_url;
            // console.log('profileUrl', profileUrl);

            // Delete the local original and compressed files
            fs.unlinkSync(profileImagePath);
            fs.unlinkSync(compressedImagePath);
        }

        // Update user details in the database
        const updateResult = await editUserByIdModel(userId, firstName, lastName, middleName, email, profileUrl, phone);
        

        if (updateResult.affectedRows > 0) {
            return res.status(200).json({ message: "User updated successfully" });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const {userId} = req.params;

        if(!userId) {
            return res.status(400).json({message : "User Id is Required!"})
        }

        const result = await deleteUserByIdModal(userId);

        return res.status(200).json({message : 'User Deleted Successfully!'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getUserCount = async (req, res) => {
  try {
    const result = await getUserCountModel();

    if (!result) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};