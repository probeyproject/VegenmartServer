import {  getQueryByQuestionModel, userQueryMobileModel } from "../../models/query.model.js";

export const handleQuery = async (req, res) => {
  try {
    const { question } = req.body;

    const queries = await getQueryByQuestionModel(question);

    if (queries && queries.length > 0) {
      const answer = queries[0].answer;
      const nextQuestionsSet = new Set();
      queries.forEach(query => {
        query.next_question.split(', ').forEach(nextQuestion => nextQuestionsSet.add(nextQuestion));
      });

      const nextQuestions = Array.from(nextQuestionsSet);
      return res.status(200).json({
        answer: answer,
        nextQuestions: nextQuestions
      });
    } else {
      return res.status(404).json({ message: 'No matching queries found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const userQueryMobile = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if(!phone) {
      return res.status(500).json({ message: 'Please Provide Mobile no.' });
    }

    const result = await userQueryMobileModel(phone);
    return res.status(201).json({ message: 'Your Query Resolve within a days' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};