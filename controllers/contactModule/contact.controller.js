import {
  createContactModel,
  deleteContactByIdModel,
  getAllContactModel,
  getContactByIdModel,
} from "../../models/contact.model.js";

export const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return res
        .status(400)
        .json({
          message:
            "All fields are (firstName, lastName, email, phone, message) Required!",
        });
    }

    const result = await createContactModel(
      firstName,
      lastName,
      email,
      phone,
      message
    );

    if (!result) {
      return res
        .status(400)
        .json({
          message:
            "Contact not send Please try again make sure fill correct details",
        });
    }

    return res
      .status(201)
      .json({ message: "Contact Send Successfully!", result });
  } catch (error) {
    console.log("Internal Server Error", error);
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};

export const getAllContact = async (req, res) => {
  try {
    const result = await getAllContactModel();

    if (result.length === 0) {
      return res.status(400).json({ message: "Contact Us not found!" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log("Internal Server Error", error);
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;

    if (!contactId) {
      return res.status(400).json({ message: "Contact Id is required or valid" });
    }
    const result = await getContactByIdModel(contactId);

    if (!result) {
      return res.status(400).json({ message: "Contact Us not found!" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log("Internal Server Error", error);
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};

export const editContactById = async (req, res) => {
    try {
      const { contactId } = req.params;
  
      if (!contactId) {
        return res.status(400).json({ message: "Contact Id is required or valid" });
      }
      const result = await getContactByIdModel(contactId);
  
      if (!result) {
        return res.status(400).json({ message: "Contact Us not found!" });
      }
  
      return res.status(200).json(result);
    } catch (error) {
      console.log("Internal Server Error", error);
      return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  };

  export const deleteContactById = async (req, res) => {
    try {
      const { contactId } = req.params;
  
      if (!contactId) {
        return res.status(400).json({ message: "Contact Id is required or valid" });
      }
      const result = await deleteContactByIdModel(contactId);
  
      if (!result) {
        return res.status(400).json({ message: "Contact Us not found!" });
      }
  
      return res.status(200).json({ message : "Contact Us deleted Successfully!" });
    } catch (error) {
      console.log("Internal Server Error", error);
      return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  };