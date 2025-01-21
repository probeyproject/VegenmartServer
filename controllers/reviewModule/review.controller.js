import { createReviewModel, deleteReviewByIdModel, editReviewByIdModel, getAllReviewByProductIdModel, getAllReviewModel, getReviewByIdModel } from "../../models/review.model.js";

export const createReview = async (req, res) => {
    try {
        const reviewUser = req.params.reviewUser
        const [userId, productId] = reviewUser.split('&');
        // const {userId, productId} = req.params;

        const {rating, comment} = req.body;

        if(!userId || !productId) {
            return res.status(400).json({message : "User and Product Id is Required!"})
        }

        if(!rating || !comment) {
            return res.status(400).json({message : "All fields are Required!"})
        }

        const result = await createReviewModel(userId, productId, rating, comment);

        if(!result) {
            return res.status(400).json({message : "Review not Created!"})
        }

        return res.status(201).json({message : "Review Created Successfully!", data : result.insertId});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getAllReview = async (req, res) => {
    try {
        const result = await getAllReviewModel();

        if(!result) {
            return res.status(400).json({message : "Review Not Present!"})
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getReviewById = async (req, res) => {
    try {
        const {reviewId} = req.params;

        if(!reviewId) {
            return res.status(400).json({message : "Review Id is Required!"});
        }

        const result = await getReviewByIdModel(reviewId);

        if(!result) {
            return res.status(400).json({message : "Review Not Present!"})
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const editReviewById = async (req, res) => {
    try {
        const {reviewId} = req.params;
        const {rating, comment} = req.body;

        if(!reviewId) {
            return res.status(400).json({message : "User and Product Id is Required!"})
        }

        const result = await editReviewByIdModel(rating, comment, reviewId);

        if(!result) {
            return res.status(400).json({message : "Review Not Updated!"});
        }

        return res.status(200).json({message : "Review Updated Successfuly!", data : result.insertId});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const deleteReviewById = async (req, res) => {
    try {
        const {reviewId} = req.params;

        if(!reviewId) {
            return res.status(400).json({message : "Review Id is Required"});
        }

        const result = await deleteReviewByIdModel(reviewId);

        if(!result) {
            return res.status(400).json({message : "Review Not Deleted!"})
        }

        return res.status(200).json({message : "Review Deleted Successfully!"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getAllReviewByProductId = async (req, res) => {
    try {
        const {productId} = req.params;

        if(!productId) {
            return res.status(400).json({message : "Product Id is Required!"});
        }

        const result = await getAllReviewByProductIdModel(productId);

        if(!result) {
            return res.status(400).json({message : "Review Not Present!"})
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}