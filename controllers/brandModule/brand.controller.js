import { createBrandModel, deleteBrandByIdModel, ediBrandByIdModel, getAllBrandModel, getBrandByIdModel } from "../../models/brand.model.js";

export const createBrand = async (req, res) => {
    try {
         const {brandName, status} = req.body;

         if(!brandName) {
            return res.status(400).json({message : "Brand name is required!"})
         }

         const result = await createBrandModel(brandName, status);

         if(!result) {
            return res.status(400).json({message : "Brands not created"})
         }

         return res.status(201).json({message :  "Brand Created Successfully", data : result});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getAllBrand = async (req, res) => {
    try {
        const result = await getAllBrandModel();

        if(!result) {
            return res.status(400).json({message : "Brand Name is not present"})
        }

        return res.status(200).json(result)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getBrandById = async (req, res) => {
    try {
        const { brandId } = req.params;

        if(!brandId) {
            return res.status(400).json({ message : "Brand Id is required!" })
        }

        const result = await getBrandByIdModel(brandId);

        if(!result) {
            return res.status(400).json({message : "Brand is not present!"})
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const editBrandById = async (req, res) => {
    try {
        const { brandId } = req.params;
        const { brandName, status } = req.body;

        if(!brandId) {
            return res.status(400).json({message : "Brand Id is Required!"});
        }

        const result = await ediBrandByIdModel(brandName, status, brandId);

        if(!result) {
            return res.status(400).json({message : "Brand not updated"});
        }

        return res.status(200).json({message : "Brand Name updated Successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const deleteBrandById = async (req, res) => {
    try {
        const { brandId } = req.params;

        if(!brandId) {
            return res.status(400).json({message : "Brand Id is Required!"});
        }

        const result = await deleteBrandByIdModel(brandId);

        if(!result) {
            return res.status(400).json({message : "Brand not deleted"});
        }

        return res.status(200).json({message : "Brand deleted Successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}