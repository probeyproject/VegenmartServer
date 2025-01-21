import db from "../db/db.js";

export const getQueryByQuestionModel = async (question) => {
  try {
    const [rows] = await db.query(
      "SELECT question, answer, next_question FROM queries WHERE question LIKE ?",
      [`%${question}%`]
    );

    return rows.length === 0 ? null : rows;
  } catch (error) {
    console.log(error);
    throw new Error("DB error", error);
  }
};

export const userQueryMobileModel = async (phone) => {
  try {
    const query = "INSERT INTO customer_query (phone) VALUES (?)"
    const [result] = await db.query(query, [phone]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log(error);
    throw new Error("DB error", error);
  }
};