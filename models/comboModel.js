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
    // Step 1: Get combo details from `combos` table
    const comboDetailQuery = `SELECT * FROM combos WHERE combo_id = ?`;
    const [comboDetails] = await db.query(comboDetailQuery, [id]);

    if (comboDetails.length === 0) {
      return null; // No combo found
    }

    const combo = comboDetails[0]; // Extract first combo

    // Step 2: Get all products associated with this combo
    const comboProductsQuery = `
      SELECT cp.combo_id, cp.product_id, cp.quantity, cp.quantity_type, 
             p.product_name, p.product_price, p.product_image 
      FROM combo_products cp
      JOIN product p ON cp.product_id = p.product_id
      WHERE cp.combo_id = ?
    `;

    const [comboProducts] = await db.query(comboProductsQuery, [id]);

    // Step 3: Combine results into a single object
    return {
      combo_id: combo.combo_id,
      title: combo.title,
      price: combo.price,
      description: combo.description,
      weight: combo.Gross_weight,
      weight_type: combo.Gross_weight_type,
      products: comboProducts.map((product) => ({
        product_id: product.product_id,
        product_name: product.product_name,
        product_price: product.product_price,
        product_image: product.product_image,
        quantity: product.quantity,
        quantity_type: product.quantity_type,
      })),
    };
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

export const updateCombo = async (
  id,
  price,
  title,
  product_image,
  description
) => {
  console.log(product_image);
  try {
    // Fetch the existing product image if a new one is not provided
    const [[existingCombo]] = await db.query(
      `SELECT product_image FROM combos WHERE combo_id = ?`,
      [id]
    );

    const query = `
      UPDATE combos
      SET 
        price = ?, 
        product_image = ?, 
        title = ?, 
        description = ?
      WHERE combo_id = ?
    `;

    const [result] = await db.query(query, [
      price,
      product_image || existingCombo.product_image,
      title,
      description,
      id,
    ]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Database error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
};

export const deleteCombo = async (id) => {
  try {
    const query = "DELETE FROM combos WHERE combo_id = ?";
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Database error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
};
