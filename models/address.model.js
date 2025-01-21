import db from "../db/db.js";

export const getUserByIdModel = async (user_id) => {
  try {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [
      user_id,
    ]);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUserPhoneModel = async (user_id, phone) => {
  try {
    // Ensure the phone number starts with +91
    let formattedPhone = phone;

    // If the phone number does not already start with '+91', add it
    if (!phone.startsWith("+91")) {
      formattedPhone = "+91" + phone;
    }

    const [result] = await db.query("UPDATE users SET phone = ? WHERE id = ?", [
      formattedPhone,
      user_id,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createAddressModel = async (
  user_id,
  address_type,
  flat,
  floor,
  area,
  landmark,
  state,
  postal_code,
  name,
  phone
) => {
  try {
    let formattedPhone = phone;

    if (!phone.startsWith("+91")) {
      formattedPhone = "+91" + phone;
    }

    const [result] = await db.query(
      "INSERT INTO addresses (user_id, address_type, flat, floor, area, landmark, state, postal_code, name, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        address_type,
        flat,
        floor,
        area,
        landmark,
        state,
        postal_code,
        name,
        formattedPhone,
      ]
    );
    return result.insertId
      ? {
          id: result.insertId,
          user_id,
          address_type,
          flat,
          floor,
          area,
          landmark,
          state,
          postal_code,
          name,
          formattedPhone,
        }
      : null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAddressModel = async () => {
  try {
    const query = "SELECT * FROM addresses";
    const [result] = await db.query(query);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error("Error in editAddressByIdModel:", error);
    throw error;
  }
};

export const getAddressByIdModel = async (userId) => {
  try {
    const query = "SELECT * FROM addresses WHERE user_id = ?";
    const [result] = await db.query(query, [userId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error("Error in editAddressByIdModel:", error);
    throw error;
  }
};

export const getAddressByAddressIdModel = async (addressId) => {
  try {
    const query = "SELECT * FROM addresses WHERE address_id = ?";
    const [result] = await db.query(query, [addressId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error("Error in editAddressByIdModel:", error);
    throw error;
  }
};

export const editAddressByIdModel = async (
  address_id,
  address_type,
  flat,
  floor,
  area,
  landmark,
  state,
  postal_code,
  name,
  phone
) => {
  try {
    // Ensure the phone number starts with +91
    let formattedPhone = phone;
    if (!phone.startsWith("+91")) {
      formattedPhone = "+91" + phone;
    }

    const query = `UPDATE addresses 
                       SET address_type = ?, flat = ?, floor = ?, area = ?, 
                           landmark = ?, state = ?, postal_code = ?, name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
                       WHERE address_id = ?`;

    const [result] = await db.query(query, [
      address_type,
      flat,
      floor,
      area,
      landmark,
      state,
      postal_code,
      name,
      formattedPhone,
      address_id,
    ]);

    return result.affectedRows === 0 ? null : result;
  } catch (error) {
    console.error("Error in editAddressByIdModel:", error);
    throw error;
  }
};

export const deleteAddressByIdModel = async (addressId) => {
  try {
    const query = "DELETE FROM addresses WHERE address_id = ?";
    const [result] = await db.query(query, [addressId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.error("Error in editAddressByIdModel:", error);
    throw error;
  }
};
