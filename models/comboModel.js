import db from "../db/db.js";

// Function to insert a combo into the database
export const createcombo = async (product_id,price,product_image, title, description) => {
  const productIdsJson = JSON.stringify(product_id);
  try {
    // Debugging input values
    console.log("Inputs - Product ID:", product_id, "price",price,"Title:", title,"product_image:",product_image, "Description:", description);

    const query = "INSERT INTO combos (product_id, price, title, product_image ,description) VALUES (?, ?,?, ?, ?)";
    const [result] = await db.query(query, [productIdsJson, price,product_image, title, description]);

    // Debugging the result of the query
    console.log("Query Result:", result);

    // Check affectedRows in the result
    return result.affectedRows > 0 ? result : null;
  } catch (error) {
    console.error("Database error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
};

export const getAllCombos = async () => {
  try {
    const query = "SELECT * FROM combos";
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Database error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
};

export const getComboById = async (id) => {
  try {
    const query = "SELECT * FROM combos WHERE id = ?";
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Database error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
};


export const updateCombo = async (id, product_id, price, product_image, title, description) => {
  const productIdsJson = JSON.stringify(product_id);
  try {
    const query = `
      UPDATE combos
      SET product_id = ?, price = ?, product_image = ?, title = ?, description = ?
      WHERE id = ?
    `;
    const [result] = await db.query(query, [productIdsJson, price, product_image, title, description, id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Database error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
};


export const deleteCombo = async (id) => {
  try {
    const query = "DELETE FROM combos WHERE id = ?";
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Database error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
};
