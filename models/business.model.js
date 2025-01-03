import db from "../db/db.js";

export const createBusinessModel = async (
  firstName,
  lastName,
  email,
  phone,
  address,
  message,
  product_image
) => {
  try {
    const query =
      "INSERT INTO businesses (first_name, last_name, email, phone_number, address, message, product_image) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [
      firstName,
      lastName,
      email,
      phone,
      address,
      message,
      product_image,
    ]);
    return result; // Ensure the result is returned
  } catch (error) {
    console.log("business model error:", error);
    throw new Error("DB Model Error");
  }
};

export const getAllBusinessModel = async () => {
  try {
    const query = "SELECT * FROM businesses";
    const [result] = await db.query(query);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log("business model", error);
    throw new Error("DB Model Error");
  }
};

export const getBusinessByIdModel = async (businesId) => {
  try {
    const query = "SELECT * FROM businesses WHERE business_id = ?";
    const [result] = await db.query(query, [businesId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log("business model", error);
    throw new Error("DB Model Error");
  }
};

export const deleteBusinessByIdModel = async (businesId) => {
  try {
    const query = "DELETE FROM businesses WHERE business_id = ?";
    const [result] = await db.query(query, [businesId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log("business model", error);
    throw new Error("DB Model Error");
  }
};
