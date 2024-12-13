import { createNewsEmailModel, deleteNewsEmailByIdModel, getNewsEmailModel } from "../../models/news_email.model.js";


export const createNewsEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await createNewsEmailModel(email);

        if (!result) {
            return res.status(400).json({ message: "news email created!" });
        }

        return res.status(201).json({ message: "news email created successfully!" });
    } catch (error) {
        console.log('news email Error', error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
  

export const getAllNewsEmail = async (req, res) => {
    try {
        const results = await getNewsEmailModel();

        if(!results) {
            return res.status(400).json({message : 'news email is not present'});
        }

        return res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


export const deleteNewsEmailById = async (req, res) => {
    try {
        const {newsId} = req.params;

        if(!newsId) {
            return res.status(400).json({message : "Please Provide newsId Id or Invalid"});
        }

        const results = await deleteNewsEmailByIdModel(newsId);

        if(!results) {
            return res.status(400).json({message : "news email is not Present"});
        }

        return res.status(200).json({message : "news email deleted Successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
