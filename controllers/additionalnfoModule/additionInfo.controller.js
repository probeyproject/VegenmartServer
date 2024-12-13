import { createAdditionInfoModel, deleteAdditionInfoByIdModel, editAdditionInfoByIdModel, getAdditionInfoForEditByIdModel, getAllAdditionInfoModel, getByAdditionInfoIdModel } from "../../models/additionalnfo.model.js";

export const createAdditionInfo = async (req, res) => {
    try {
        const { categoryId } = req.params;
       const { specialty, IngredientType, brand, form, packageInformation, manufacture } = req.body;

       if(!categoryId) {
        return res.status(400).json({ message : "category Id is required!" });
      }

       const result = await createAdditionInfoModel(specialty, IngredientType, brand, form, packageInformation, manufacture, categoryId);

       if(!result) {
        return res.status(400).json({ message : "Error : AdditionInfo not created!" }) 
       }

       return res.status(201).json({ message : "AdditionInfo Created Successfully!" });
    } catch (error) {
        console.log('AdditionInfo Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getAllAdditionInfo = async (req, res) => {
    try {
        const result = await getAllAdditionInfoModel();

        if(!result) {
            return res.status(400).json({message : 'additioninfo is not present at this time'});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('additioninfo Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getAdditionInfoById = async (req, res) => {
    try {
        const {categoryId} = req.params;
        if(!categoryId) {
            return res.status(400).json({message : "Please Provide Valid category Id"})
        }

        const result = await getByAdditionInfoIdModel(categoryId);
        if(!result) {
            return res.status(400).json({message : "additioninfo is not Present"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('additioninfo Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


export const editAdditionInfoById = async (req, res) => {
    try {
        const {additionalId} = req.params;
        const {specialty, IngredientType, brand, form, packageInformation, manufacture} = req.body;
        
        if(!additionalId) {
            return res.status(400).json({message : "additional Id is Required! or Invalid Id"})
        }
        
        const result = await editAdditionInfoByIdModel(specialty, IngredientType, brand, form, packageInformation, manufacture, additionalId);

        return res.status(200).json({message : "additioninfo updated Successfully!"});
    } catch (error) {
        console.log('additioninfo Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const deleteAdditionInfoById = async (req, res) => {
    try {
        const {additionalId} = req.params;
        if(!additionalId) {
            return res.status(400).json({message : "Please Provide Valid additionalId Id"})
        }

        const result = await deleteAdditionInfoByIdModel(additionalId);
        if(!result) {
            return res.status(400).json({message : "additioninfo is not Present"});
        }

        return res.status(200).json({message : "additioninfo Delete Successfully!"});
    } catch (error) {
        console.log('additioninfo Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}