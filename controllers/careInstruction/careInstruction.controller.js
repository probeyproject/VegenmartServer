import { createCareInstructionModel, deleteCareInstructionByIdModel, editCareInstructionByIdModel, getAllCareInstructionModel, getByCareInstructionIdModel } from "../../models/careInstruction.model.js";

export const createCareInstruction = async (req, res) => {
    try {
        const { categoryId } = req.params;
       const { careInstruction } = req.body;

       if(!categoryId) {
        return res.status(400).json({ message : "category Id is required!" });
      }

       if(!careInstruction) {
         return res.status(400).json({ message : "careInstruction is required!" });
       }

       const result = await createCareInstructionModel(categoryId, careInstruction);

       if(!result) {
        return res.status(400).json({ message : "Error : createcareInstruction not created!" }) 
       }

       return res.status(201).json({ message : "createcareInstruction Created Successfully!" });
    } catch (error) {
        console.log('createcareInstruction Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getAllCareInstruction = async (req, res) => {
    try {
        const result = await getAllCareInstructionModel();

        if(!result) {
            return res.status(400).json({message : 'CareInstruction is not present at this time'});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('CareInstruction Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getCareInstructionById = async (req, res) => {
    try {
        const {categoryId} = req.params;
        if(!categoryId) {
            return res.status(400).json({message : "Please Provide Valid category Id"})
        }

        const result = await getByCareInstructionIdModel(categoryId);
        if(!result) {
            return res.status(400).json({message : "CareInstruction is not Present"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('Offer Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const editCareInstructionById = async (req, res) => {
    try {
        const {careId} = req.params;
        const {careInstruction} = req.body;
        
        
        if(!careId) {
            return res.status(400).json({message : "care Id is Required! or Invalid Id"})
        }
        
        const result = await editCareInstructionByIdModel(careInstruction, careId);

        return res.status(200).json({message : "CareInstruction updated Successfully!"});
    } catch (error) {
        console.log('CareInstruction Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const deleteCareInstructionById = async (req, res) => {
    try {
        const {careId} = req.params;
        if(!careId) {
            return res.status(400).json({message : "Please Provide Valid care Id"})
        }

        const result = await deleteCareInstructionByIdModel(careId);
        if(!result) {
            return res.status(400).json({message : "CareInstruction is not Present"});
        }

        return res.status(200).json({message : "CareInstruction Delete Successfully!"});
    } catch (error) {
        console.log('CareInstruction Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}