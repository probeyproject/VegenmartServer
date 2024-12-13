import {
  createAddressModel,
  deleteAddressByIdModel,
  editAddressByIdModel,
  getAddressByAddressIdModel,
  getAddressByIdModel,
  getAddressModel,
  getUserByIdModel,
  updateUserPhoneModel,
} from "../../models/address.model.js";
import db from "../../db/db.js";

export const createAddress = async (req, res) => {
    try {
      const {
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
      } = req.body;
  
      // Fetch the user by user_id to get the current phone number
      const user = await getUserByIdModel(user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
    //   // If the phone number entered is different from the one in the users table, update it
    //   if (phone && phone !== user.phone) {
    //     const updatePhoneResult = await updateUserPhoneModel(user_id, phone);
    //     if (!updatePhoneResult) {
    //       return res
    //         .status(500)
    //         .json({ message: "Failed to update user phone number" });
    //     }
    //   }
  
      // Create the address in the address table
      const result = await createAddressModel(
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
      );
  
      if (!result) {
        return res.status(400).json({ message: "Address creation failed" });
      }
  
      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

export const getAllAddress = async (req, res) => {
  try {
    const result = await getAddressModel();

    if (!result) {
      return res.status(404).json({ message: "Address Not Found" });
    }

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "user Id is required!" });
    }

    const result = await getAddressByIdModel(userId);

    if (!result) {
      return res.status(404).json({ message: "Address Not Found" });
    }

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAddressByAddressId = async (req, res) => {
  try {
    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({ message: "user Id is required!" });
    }

    const result = await getAddressByAddressIdModel(addressId);

    if (!result) {
      return res.status(404).json({ message: "Address Not Found" });
    }

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editAddressById = async (req, res) => {
    try {
        const { address_id } = req.params;
        const {
            address_type,
            flat,
            floor,
            area,
            landmark,
            state,
            postal_code,
            name,
            phone,
        } = req.body;

        // Format phone number with +91 if needed
        let formattedPhone = phone;
        if (!phone.startsWith("+91")) {
            formattedPhone = "+91" + phone;
        }

        // Update the address details without affecting the user's phone number
        const result = await editAddressByIdModel(
            address_id,
            address_type,
            flat,
            floor,
            area,
            landmark,
            state,
            postal_code,
            name,
            formattedPhone
        );

        if (!result) {
            return res
                .status(404)
                .json({ message: "Address not found or not updated" });
        }

        return res
            .status(200)
            .json({ message: "Address updated successfully", data: result });
    } catch (error) {
        console.error("Error in editAddressById:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const deleteAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({ message: "Address Id is required!" });
    }

    const result = await deleteAddressByIdModel(addressId);

    if (!result) {
      return res.status(404).json({ message: "Address Not Found" });
    }

    return res
      .status(201)
      .json({ message: "This Address Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
