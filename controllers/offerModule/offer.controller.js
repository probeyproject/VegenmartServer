import { createOfferModel, deleteOfferByIdModel, editOfferByIdModel, getAllOfferModel, getOfferByIdModel, getOfferByProductIdModel, getOfferForEditByIdModel } from "../../models/offer.model.js";

export const createOffer = async (req, res) => {
    try {
        const { productId } = req.params;
       const {offerName,offerDescription,discountType,discountValue,startDate,endDate} = req.body;
       console.log(req.body);
       

       if(!offerName || !offerDescription || !discountType || !discountValue) {
         return res.status(400).json({ message : "All fields are required!" })
       }

       const result = await createOfferModel(offerName,offerDescription,discountType,discountValue,startDate,endDate,productId);

       if(result.error === "Invalid Product Id") {
        return res.status(400).json({ message : "Please Provide a Valid Product Id" }) 
       }

       if(!result) {
        return res.status(400).json({ message : "Error : Offer not created!" }) 
       }

       return res.status(201).json({ message : "Offer Created Successfully!" });
    } catch (error) {
        console.log('Offer Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getAllOffer = async (req, res) => {
    try {
        const result = await getAllOfferModel();

        if(!result) {
            return res.status(400).json({message : 'Offer is not present at this time'});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('Offer Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getOfferById = async (req, res) => {
    try {
        const {offerId} = req.params;
        if(!offerId) {
            return res.status(400).json({message : "Please Provide Valid Offer Id"})
        }

        const result = await getOfferByIdModel(offerId);
        if(!result) {
            return res.status(400).json({message : "Offer is not Present"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('Offer Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const editOfferById = async (req, res) => {
    try {
        const {offerId} = req.params;
        const {offerName,offerDescription,discountType,discountValue,startDate,endDate} = req.body;
        // console.log(req.body);
        // console.log(req.params);
        
        

        if(!offerId) {
            return res.status(400).json({message : "Offer Id is Required! or Invalid Id"})
        }

        const existingOffer = await getOfferForEditByIdModel(offerId);
        // console.log(existingOffer);
        

        if(!existingOffer) {
            return res.status(400).json({message : "Offer is Not here!"})
        }

        const updateOfferName = offerName || existingOffer.offer_name;
        const updateofferDescription = offerDescription || existingOffer.offer_description;
        const updatediscountType = discountType || existingOffer.discount_type;
        const updatediscountValue = discountValue || existingOffer.discount_value;
        const updatestartDate = startDate || existingOffer.	start_date;
        const updateendDate = endDate || existingOffer.end_date;
        
        const result = await editOfferByIdModel(offerId,updateOfferName,updateofferDescription,updatediscountType,updatediscountValue,updatestartDate,updateendDate);

        return res.status(200).json({message : "Offer updated Successfully!"});
    } catch (error) {
        console.log('Offer Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const deleteOfferById = async (req, res) => {
    try {
        const {offerId} = req.params;
        if(!offerId) {
            return res.status(400).json({message : "Please Provide Valid Offer Id"})
        }

        const result = await deleteOfferByIdModel(offerId);
        if(!result) {
            return res.status(400).json({message : "Offer is not Present"});
        }

        return res.status(200).json({message : "Offer Delete Successfully!"});
    } catch (error) {
        console.log('Offer Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getOfferByProductId = async (req, res) => {
    try {
        const {productId} = req.params;
        if(!productId) {
            return res.status(400).json({message : "Please Provide Valid Offer Id"})
        }

        const result = await getOfferByProductIdModel(productId);
        if(!result) {
            return res.status(400).json({message : "Offer is not Present"});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log('Offer Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}