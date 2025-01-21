import { getBannerOfferModel, getFreshProductModel } from "../../models/getDataForBanner.model.js";

export const getBannerOffer = async (req, res) => {
    try {
        const { offerType } = req.params;

        if(!offerType) {
            return res.status(404).json({ message : "Offer Type is Reuired!"});
        }

        const result = await getBannerOfferModel(offerType);

        if(!result) {
            return res.status(404).json({ message : "Offer is not present at this time"}); 
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getFreshProduct = async (req, res) => {
    try {

        const result = await getFreshProductModel();

        if(!result) {
            return res.status(404).json({ message : "Fresh Product is not present at this time"}); 
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}