import db from "../db/db.js";

export const createNewsEmailModel = async (email) => {
  try {
    const query ="INSERT INTO news_email (email) VALUES (?)";
    const [results] = await db.query(query, [email]);
    return results.length === 0 ? null : results;
  } catch (error) {
    console.log("CartModel Error", error);
    throw new Error(`CartModel DB error ${error.message}`);
  }
};

export const getNewsEmailModel = async () => {
  try {
    const query = `SELECT * FROM news_email`;
    const [result] = await db.query(query);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log("CartModel Error", error);
    throw new Error(`CartModel DB error ${error.message}`);
  }
};

export const deleteNewsEmailByIdModel = async (newsId) => {
  try {
    const query = "DELETE FROM news_email WHERE id = ?";
    const [result] = await db.query(query, [newsId]);
    return result.length === 0 ? null : result;
  } catch (error) {
    console.log("CartModel Error", error);
    throw new Error(`CartModel DB error ${error.message}`);
  }
};


