import { createcombo,getAllCombos,getComboById,updateCombo,deleteCombo } from "../../models/comboModel.js";

// Controller function for creating a combo
export const createModel = async (req, res) => {
  const { product_id, price, title, description } = req.body;

  // Validate required fields
  if (!product_id ||!price || !title || !description) {
    return res.status(400).json({ Message: "All fields are required!" });
  }

  try {
    // Call the model function to insert into the database
    const result = await createcombo(product_id,price, title, description);

    if (!result) {
      return res.status(500).json({ Message: "Failed to add combo!" });
    }

    return res.status(200).json({ Message: "Combo added successfully!" });
  } catch (error) {
    console.error("Error adding combo:", error.message);
    return res.status(500).json({ Message: `Internal server error: ${error.message}` });
  }
};


export const getAllCombosController = async (req, res) => {
    try {
      const combos = await getAllCombos();
      return res.status(200).json(combos);
    } catch (error) {
      console.error("Error fetching combos:", error.message);
      return res.status(500).json({ Message: `Internal server error: ${error.message}` });
    }
  };

  
  export const getComboByIdController = async (req, res) => {
    const { id } = req.params;
  
    try {
      const combo = await getComboById(id);
  
      if (!combo) {
        return res.status(404).json({ Message: "Combo not found!" });
      }
  
      return res.status(200).json(combo);
    } catch (error) {
      console.error("Error fetching combo:", error.message);
      return res.status(500).json({ Message: `Internal server error: ${error.message}` });
    }
  };
  

  export const updateComboController = async (req, res) => {
    const { id } = req.params;
    const { product_id, price, title, description } = req.body;
  
    // Validate required fields
    if (!product_id || !price || !title || !description) {
      return res.status(400).json({ Message: "All fields are required!" });
    }
  
    try {
      const success = await updateCombo(id, product_id, price, title, description);
  
      if (!success) {
        return res.status(404).json({ Message: "Combo not found or update failed!" });
      }
  
      return res.status(200).json({ Message: "Combo updated successfully!" });
    } catch (error) {
      console.error("Error updating combo:", error.message);
      return res.status(500).json({ Message: `Internal server error: ${error.message}` });
    }
  };

  
  export const deleteComboController = async (req, res) => {
    const { id } = req.params;
  
    try {
      const success = await deleteCombo(id);
  
      if (!success) {
        return res.status(404).json({ Message: "Combo not found or deletion failed!" });
      }
  
      return res.status(200).json({ Message: "Combo deleted successfully!" });
    } catch (error) {
      console.error("Error deleting combo:", error.message);
      return res.status(500).json({ Message: `Internal server error: ${error.message}` });
    }
  };
  