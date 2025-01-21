import { addToWishlistModel, deleteWishlistModel, getAllWishlistModel } from "../../models/wishlist.model.js";

export const addToWishlist = async (req, res) => {
    try {
        const {userId, productId} = req.body;

        if(!userId || !productId) {
            return res.status(400).json({ message : "Please Provide userId or productId and Valid"});
        }

        const result = await addToWishlistModel(userId, productId);
        
        if (result.alreadyExists) {
            return res.status(400).json({ message: "Product is already in your wishlist" });
        }
        
        if(!result) {
            return res.status(400).json({ message : "Not Add Wishlist"});
        }

        return res.status(201).json({message : "Wishlist added Successfully!"});
    } catch (error) {
        console.log("Wishlist Controller Error", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getWishlist = async (req, res) => {
    try {
         const {userId} = req.params;

         if(!userId) {
            return res.status(400).json({message : "Please Provide Id and Valid"})
         }

         const result = await getAllWishlistModel(userId);

         if(!result) {
            return res.status(400).json({message : "No Wishlist at this time!"})
         }

         return res.status(200).json(result);
    } catch (error) {
        console.log("Wishlist Controller Error", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const deleteWishlist = async (req, res) => {
    try {
        const {userId, productId} = req.body;

        if(!userId || !productId) {
            return res.status(400).json({ message : "Please Provide userId or productId and Valid"});
        }

        const result = await deleteWishlistModel(userId, productId);

        if(!result) {
            return res.status(400).json({ message : "Not Wishlist deleted!"});
        }

        return res.status(200).json({ message : "Wishlist deleted Successfully!"})
    } catch (error) {
        console.log("Wishlist Controller Error", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}