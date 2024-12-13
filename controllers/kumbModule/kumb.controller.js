import { createKumbModel, deleteKumbByIdModel, editKumbByIdModel, getAllKumbModel, getKumbByIdModel } from "../../models/kumb.model.js";

export const createKumb = async (req, res) => {
    try {
        // Extract data from the request body
        const { firstName, middleName, lastName, email, phone, objective } = req.body;

        // Validate required fields
        if (!firstName || !email || !phone) {
            return res.status(400).json({ message: "First name, email, and phone are required!" });
        }

        // Call the model to insert the data
        const result = await createKumbModel(firstName, middleName, lastName, email, phone, objective);

        return res.status(201).json({ message: "Kumb Data Created Successfully!", data : result });

    } catch (error) {
        console.error('Create Kumb Controller Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export const getAllKumb = async (req, res) => {
    try {
        const result = await getAllKumbModel();

        if (result.success === false) {
            return res.status(500).json({ message: result.message });
        }

        return res.status(200).json({
            message: "Kumb data retrieved successfully.",
            data: result
        });

    } catch (error) {
        console.error('Kumb Controller Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export const getKumbById = async (req, res) => {
    try {
        const { kumbId } = req.params;

        if (!kumbId) {
            return res.status(400).json({ message: "Kumb ID is required!" });
        }

        const kumbData = await getKumbByIdModel(kumbId);

        if (!kumbData) {
            return res.status(404).json({ message: "Kumb not found!" });
        }

        return res.status(200).json({
            message: "Kumb data retrieved successfully.",
            data: kumbData
        });

    } catch (error) {
        console.error('Kumb Controller Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export const editKumbById = async (req, res) => {
    try {
        const { kumbId } = req.params;
        const updatedData = req.body; // Data from request body

        // Check if kumb_id is provided
        if (!kumbId) {
            return res.status(400).json({ message: "Kumb ID is required!" });
        }

        // Call the model function to update Kumb data
        const result = await editKumbByIdModel(kumbId, updatedData);

        // If the Kumb is not found, return 404
        if (!result) {
            return res.status(404).json({ message: "Kumb not found!" });
        }

        // If there's an error in the model function, return 500
        if (!result.success) {
            return res.status(500).json({ message: result.message });
        }

        // Return success message
        return res.status(200).json({ message: "Kumb data updated successfully!" });

    } catch (error) {
        console.error('Kumb Controller Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};


export const deleteKumbById = async (req, res) => {
    try {
        const { kumbId } = req.params;

        if (!kumbId) {
            return res.status(400).json({ message: "Kumb ID is required!" });
        }

        const result = await deleteKumbByIdModel(kumbId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: result.message });

    } catch (error) {
        console.error('Delete Kumb Controller Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};
