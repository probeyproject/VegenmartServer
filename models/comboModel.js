import db from "../db/db.js";

// Function to insert a combo into the database

export const createcombo = async (comboData, products) => {
  const { price, title, product_image, description } = comboData;

  try {
    // Insert into `combos` table
    const comboQuery =
      "INSERT INTO combos (price, title, product_image, description) VALUES (?, ?, ?, ?)";
    const [comboResult] = await db.query(comboQuery, [
      price,
      title,
      product_image,
      description,
    ]);

    if (!comboResult.insertId) {
      throw new Error("Failed to create combo!");
    }

    const comboId = comboResult.insertId;

    // Insert products into `combo_products` table
    const productQuery =
      "INSERT INTO combo_products (combo_id, product_id, quantity, quantity_type) VALUES (?, ?, ?, ?)";
    const productPromises = products.map((product) =>
      db.query(productQuery, [
        comboId,
        product.product_id,
        product.quantity,
        product.quantity_type,
        // product.price,
      ])
    );
    await Promise.all(productPromises);

    return comboResult;
  } catch (error) {
    console.error("Database error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
};


// export const createComboProduct = async (connection, combo_id, product_id, quantity, quantity_type, price) => {
//   const query = `
//     INSERT INTO combo_products (combo_id, product_id, quantity, quantity_type, price) 
//     VALUES (?, ?, ?, ?, ?);
//   `;
//   const [result] = await connection.query(query, [combo_id, product_id, quantity, quantity_type, price]);

//   return result;
// };


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
    const query = "SELECT * FROM combo_products WHERE combo_id = ?";
    const [rows] = await db.query(query, [id]);
    // return rows.length > 0 ? rows[0] : null;
    return rows;
  } catch (error) {
    console.error("Database error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
};

export const getParentComboById = async (id) => {
  try {
    const query = "SELECT * FROM combos WHERE combo_id = ?"; // Query the database
    const [rows] = await db.query(query, [id]);
    
    return rows; // Return all rows as an array, even if it's one record
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
