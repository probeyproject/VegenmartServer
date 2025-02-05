import {
  createDiscountRangeModel,
  fetchDiscountRange,
  fetchProductPrice,
  getAllDiscountRangeModel,
  getDiscountRangeByProductIdModel,
} from "../../models/price.model.js";

export const createDiscountRange = async (req, res) => {
  try {
    const { productId } = req.params;
    const { min_weight, max_weight, discount_price } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ message: "Product Id is required!", error: error.message });
    }

    const result = await createDiscountRangeModel(
      min_weight,
      max_weight,
      discount_price,
      productId
    );

    if (!result) {
      return res.status(400).json({ message: "failed calculate price" });
    }

    return res.status(201).json({
      result,
    });
  } catch (error) {
    console.log("calculatePrice Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}; 

export const calculatePrice = async (req, res) => {
  try {
    const { productId } = req.params;
    const { weight, unitType } = req.body;

    console.log(productId)

    console.log(weight,unitType)

    if (!productId) {
      return res.status(400).json({ message: "Product Id is required!" });
    }

    // Fetch the product's base price from the product table
    const product = await fetchProductPrice(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

 
    

    const basePrice = product.product_price;

    // Validate weight and unit type
    if (unitType === "kg") {
      const allowedWeights = [
        0.25, 0.5, 0.75, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ];

      if (!allowedWeights.includes(weight)) {
        return res.status(400).json({
          message:
            "Allowed weights are 250 grams (0.2kg), 500 grams (0.5kg), and 750 grams (0.75kg).",
        });
      }

      // Calculate total base price based on weight in kg
      const totalBasePrice = basePrice * weight; // Price for the selected weight (e.g., 0.75kg for 750g)

      // Fetch the discount range based on the weight
      const discountRange = await fetchDiscountRange(productId, weight);

      let finalPrice;

      // If discount exists, apply it; otherwise, return the base price
      if (discountRange) {
        const discount = discountRange.discount_price;
        const discountAmount = (totalBasePrice * discount) / 100; // Apply discount on total base price
        finalPrice = totalBasePrice - discountAmount;
      } else {
        // No discount; return total base price
        finalPrice = totalBasePrice;
      }



      // Return the calculated final price
      return res.status(201).json({
        product_id: productId,
        weight: weight, // Show weight in grams for clarity
        unitType: "kg",
        base_price: totalBasePrice, // Show the total base price before discount
        final_price: finalPrice,
        message: discountRange
          ? "Discount applied."
          : "No discount available, base price returned.",
      });
    } else if (unitType === "pieces") {
      // No discount for pieces; just return the base price
      const minPieces = 5; // Minimum 5 pieces
      if (weight < minPieces) {
        return res.status(400).json({
          message: "Minimum purchase is at least 5 pieces.",
        });
      }

      // Return the base price multiplied by the number of pieces
      return res.status(201).json({
        product_id: productId,
        weight: weight,
        unitType: unitType,
        final_price: basePrice * weight, // No discount applied
        message: "No discount for pieces, base price applied.",
      });
    } else {
      return res.status(400).json({
        message: "Invalid unit type. Choose 'kg' or 'pieces'.",
      });
    }
  } catch (error) {
    console.log("calculatePrice Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};




export const getAllDiscountRange = async (req, res) => {
  try {
    const result = await getAllDiscountRangeModel();
    if (!result) {
      return res.status(400).json({ message: "Not present!" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("calculatePrice Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getDiscountRangeByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res
        .status(400)
        .json({ message: "Please Provide Valid Product Id or Required!" });
    }
    const result = await getDiscountRangeByProductIdModel(productId);

    if (!result) {
      return res.status(400).json({ message: "Not present!" });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.log("calculatePrice Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// export const calculatePrice = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { weight, unitType } = req.body;

//     if (!productId) {
//       return res.status(400).json({ message: "Product Id is required!" });
//     }

//     // Fetch the product's base price and weight type from the product table
//     const product = await fetchProductPrice(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found!" });
//     }

//     const basePrice = product.product_price;
//     const weightType = product.weight_type; // Get weight type from the product

//     // Validate weight and unit type based on the product's weight type
//     if (unitType === "Kg") {
//       // Check if the product supports kg
//       if (weightType !== "Kg") {
//         return res.status(400).json({ message: "Weight type mismatch: Product supports 'kg' only." });
//       }

//       const allowedWeights = [0.25, 0.5, 0.75, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30, 35, 40, 45, 50];

//       if (!allowedWeights.includes(weight)) {
//         return res.status(400).json({
//           message: "Allowed weights are 250 grams (0.25kg), 500 grams (0.5kg), and 750 grams (0.75kg).",
//         });
//       }

//       // Calculate total base price based on weight in kg
//       const totalBasePrice = basePrice * weight; // Price for the selected weight

//       // Fetch the discount range based on the weight
//       const discountRange = await fetchDiscountRange(productId, weight);

//       let finalPrice;

//       // If discount exists, apply it; otherwise, return the base price
//       if (discountRange) {
//         const discount = discountRange.discount_price;
//         const discountAmount = (totalBasePrice * discount) / 100; // Apply discount on total base price
//         finalPrice = totalBasePrice - discountAmount;
//       } else {
//         finalPrice = totalBasePrice; // No discount
//       }

//       // Return the calculated final price
//       return res.status(201).json({
//         product_id: productId,
//         weight: weight, // Show weight in kg
//         unitType: "Kg",
//         base_price: totalBasePrice, // Total base price before discount
//         final_price: finalPrice,
//         message: discountRange ? "Discount applied." : "No discount available, base price returned.",
//       });

//     } else if (unitType === "pieces") {
//       // Check if the product supports pieces
//       if (weightType !== "pieces") {
//         return res.status(400).json({ message: "Weight type mismatch: Product supports 'pieces' only." });
//       }

//       const minPieces = 5; // Minimum 5 pieces
//       if (weight < minPieces) {
//         return res.status(400).json({
//           message: "Minimum purchase is at least 5 pieces.",
//         });
//       }

//       // Return the base price multiplied by the number of pieces
//       return res.status(201).json({
//         product_id: productId,
//         quantity: weight,
//         unitType: unitType,
//         final_price: basePrice * weight, // No discount applied
//         message: "No discount for pieces, base price applied.",
//       });

//     } else {
//       return res.status(400).json({
//         message: "Invalid unit type. Choose 'kg' or 'pieces'.",
//       });
//     }
//   } catch (error) {
//     console.log("calculatePrice Error", error);
//     return res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };
