import jwt from "jsonwebtoken";
import { getUserByIdModel, getUserCartsModel, getUserWishlistModel } from "../../models/user.model.js";



export const check = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    console.log('token', token);
    console.log(req);
    
    
    if (!token) {
      return res.status(400).json({ message: "LogIn first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
  
    const user = await getUserByIdModel(userId);
    
    if (!user || user.length === 0) {
      return res.status(400).json({ message: "User not exist" });
    }


    const carts = await getUserCartsModel(userId);
    
    const wishlist = await getUserWishlistModel(userId);

    return res.status(200).json({
      user: {
        id: user[0].id,
        email: user[0].email,
        role: user[0].role,
        profileImageUrl: user[0].profileurl,
        name: `${user[0].first_name} ${user[0].middle_name} ${user[0].last_name}`,
        carts: carts || [], 
        wishlist: wishlist || [],
      }
    });

  } catch (error) {
    console.error("Error in check API:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
