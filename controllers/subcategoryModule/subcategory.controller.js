import { createSubcategoryModel, deleteSubcategoryByIdModel, editSubcategoryByIdModel, filterSubcategoryByIdModel, getAllSubcategoryModel, getSubcategoryByIdModel } from "../../models/subcategory.model.js";

export const createSubcategory = async (req, res) => {
    try {
        const { subcategoryName, description, status } = req.body;
        
        const { categoryId } = req.params;

        if(!categoryId) {
            return res.status(400).json({message : "Category Id is Required in params and Valid Category Id Provide"});
        }

        if(!subcategoryName || !description) {
            return res.status(400).json({message : "All fields are required!"})
        }

        // Call the model function
        const result = await createSubcategoryModel(subcategoryName, description, categoryId, status);

        // Check for errors
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(201).json({ message: 'Subcategory created successfully', data: result });
    } catch (error) {
        console.log('CreateSubcategory Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



export const getAllSubcategory = async (req, res) => {
    try {
        const result = await getAllSubcategoryModel();

        if(!result) {
            return res.status(400).json({message : "Subcategory is not available"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getSubcategoryById = async (req, res) => {
    try {
        const { subcategoryId } = req.params;

        if(!subcategoryId) {
            return res.status(400).json({message : "Subcategory Id is Invalid"});
        }

        const result = await getSubcategoryByIdModel(subcategoryId);

        if(!result) {
            return res.status(400).json({message : "Subcategory is empty"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const editSubcategoryById = async (req, res) => {
    try {
        const {categoryId} = req.params;
        const {subcategoryName, description, status} = req.body;

        const result = await editSubcategoryByIdModel(subcategoryName, description, status, categoryId);

        if(!result) {
            return res.status(400).json({message : "Subcategory not update"});
        }

        return res.status(200).json({message : "Subcategory updated successfully!"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const deleteSubcategoryById = async (req, res) => {
    try {
        const {subcategoryId} = req.params;

        if(!subcategoryId) {
            return res.status(400).json({message : "Subcategory Id in Invalid"})
        }

        const result = deleteSubcategoryByIdModel(subcategoryId);

        if(!result) {
            return res.status(400).json({message : "Subcategory not present"});
        }

        return res.status(200).json({message : "Subcategory deleted Successfully!"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const filterSubcategoryById = async (req, res) => {
    try {
        const {categoryId} = req.params;       

        if(!categoryId) {
            return res.status(400).json({message : "category Id in Invalid"})
        }

        const result = await filterSubcategoryByIdModel(categoryId);

        if(!result) {
            return res.status(400).json({message : "category not present"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}