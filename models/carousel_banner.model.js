
import db from '../db/db.js';
export const createCarouselBannerModel = async (carouselBannerData) => {
  try {
    const query = `INSERT INTO carousel_banner (heading, offer_heading, banner_image) VALUES (?, ?, ?)`;
    const values = [carouselBannerData.heading, carouselBannerData.offerHeading, carouselBannerData.carouselBannerPic];
    const [result] = await db.query(query, values);
    return result.length === 0 ? null : result;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const getAllCarouselBannerModel = async () => {
  try {
    const query = `SELECT * FROM carousel_banner`;
    const [result] = await db.query(query);
    return result.length === 0 ? null : result;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const getCarouselBannerByIdModel = async (carouselBannerId) => {
  try {
    const query = `SELECT * FROM carousel_banner WHERE id = ?`;
    const [result] = await db.query(query, [carouselBannerId]);
    return result[0];
  } catch (err) {
    throw new Error(err.message);
  }
};


export const updateCarouselBannerModel = async (carouselBannerId, carouselBannerData) => {
  try {
    const query = `UPDATE carousel_banner SET heading = ?, offer_heading = ?, banner_image = ? WHERE id = ?`;
    const values = [carouselBannerData.heading, carouselBannerData.offerHeading, carouselBannerData.carouselBannerPic, carouselBannerId];
    const [result] = await db.query(query, values);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};


export const deleteCarouselBannerModel = async (carouselBannerId) => {
  try {
    const query = `DELETE FROM carousel_banner WHERE id = ?`;
    const [result] = await db.query(query, [carouselBannerId]);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
