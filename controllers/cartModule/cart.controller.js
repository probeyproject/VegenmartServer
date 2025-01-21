import { createCartModel, deleteCartByIdModel, getAllCardByUserIdModel, getAllCartModel, getCardByIdModel, getCartProductsByUserId, getRelatedProducts, updateCartModel } from "../../models/cart.model.js";


export const createCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId,totalPrice,quantity,cartStatus,weight,weight_type } = req.body;
          
        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required or invalid.' });
        }

        // Create order and check for errors
        const result = await createCartModel(userId, productId, totalPrice, quantity, cartStatus, weight, weight_type);

        // Handle specific error cases
        if (result.error === 'Invalid userId') {
            return res.status(400).json({ message: "Invalid userId. Please provide a valid user ID." });
        }

        if (result.error === 'Invalid productId') {
            return res.status(400).json({ message: "Invalid productId. Please provide a valid product ID." });
        }

        if (!result) {
            return res.status(400).json({ message: "Cart not created!" });
        }

        // Success response
        return res.status(201).json({ message: "Cart created successfully!" });

    } catch (error) {
        console.log('CreateOrder Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};





export const updateCart = async (req, res) => {
    try {
      const { userId, productId } = req.params;
      const { totalPrice, quantity, cartStatus, weight, weight_type } = req.body;
  
      // Check if userId and productId are provided
      if (!userId || !productId) {
        return res.status(400).json({ message: 'User ID and Product ID are required.' });
      }
  
      // Call the update cart model to perform the update operation
      const result = await updateCartModel(userId, productId, totalPrice, quantity, cartStatus, weight, weight_type);
  
      // Handle specific error cases
      if (result.error === 'Invalid userId') {
        return res.status(400).json({ message: "Invalid userId. Please provide a valid user ID." });
      }
  
      if (result.error === 'Invalid productId') {
        return res.status(400).json({ message: "Invalid productId. Please provide a valid product ID." });
      }
  
      if (result.error === 'Cart not found for this user and product') {
        return res.status(404).json({ message: "No cart found for this user and product." });
      }
  
      if (result.error === 'Cart update failed') {
        return res.status(400).json({ message: "Failed to update the cart." });
      }
  
      // Success response
      return res.status(200).json({ message: "Cart updated successfully!", result });
  
    } catch (error) {
      console.log("UpdateCart Error", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  

export const getAllCart = async (req, res) => {
    try {
        const results = await getAllCartModel();

        if(!results) {
            return res.status(400).json({message : 'Cart is not present'});
        }

        return res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getCartById = async (req, res) => {
    try {
        const {cartId} = req.params;

        if(!cartId) {
            return res.status(400).json({message : "Please Provide Order Id or Invalid"});
        }

        const results = await getCardByIdModel(cartId);

        if(!results) {
            return res.status(400).json({message : "Cart is not Present"});
        }

        return res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getAllCartByUserId = async (req, res) => {
    try {
        const {userId} = req.params;

        if(!userId) {
            return res.status(400).json({message : "Please Provide Order Id or Invalid"});
        }

        const results = await getAllCardByUserIdModel(userId);

        if(!results) {
            return res.status(400).json({message : "Cart is not Present"});
        }

        return res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const deleteCartById = async (req, res) => {
    try {
        const {cartId} = req.params;

        if(!cartId) {
            return res.status(400).json({message : "Please Provide Product Id or Invalid"});
        }

        const results = await deleteCartByIdModel(cartId);

        if(!results) {
            return res.status(400).json({message : "Order is not Present"});
        }

        return res.status(200).json({message : "Order deleted Successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


// Get cart products and related products
export const getRelevantProducts = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Step 1: Fetch the cart products
      const cartProducts = await getCartProductsByUserId(userId);
      if (cartProducts.length === 0) {
        return res.status(404).json({ message: 'No products found in cart' });
      }
  
      // Step 2: Extract categories from the cart products
      const categories = [...new Set(cartProducts.map(product => product.category_name))];
  
      // Step 3: Fetch related products based on categories
      const relatedProducts = await getRelatedProducts(categories);
  
      if (relatedProducts.length === 0) {
        return res.status(404).json({ message: 'No related products found' });
      }
  
      return res.status(200).json({
        message: 'Related products fetched successfully',
        data: relatedProducts
      });
    } catch (error) {
      console.error('Error in getRelevantProducts:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
