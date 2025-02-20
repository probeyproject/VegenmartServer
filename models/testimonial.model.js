import db from "../db/db.js";
export const createTestimonialModel = async (testimonialData) => {
  try {
    const query = `INSERT INTO testimonials (user_id, message, name, city, testimonial_pic) VALUES (?, ?, ?, ?, ?)`;
    const values = [
      testimonialData.userId,
      testimonialData.message,
      testimonialData.name,
      testimonialData.city,
      testimonialData.testimonialPic,
    ];

    const [result] = await db.query(query, values);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getAllTestimonialsModel = async () => {
  try {
    const query = `SELECT testimonial_id, message,name,testimonial_pic,city FROM testimonials ORDER BY created_at DESC`;
    const [results] = await db.query(query);
    return results;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getTestimonialByIdModel = async (testimonialId) => {
  try {
    const query = `SELECT * FROM testimonials WHERE testimonial_id = ?`;
    const [result] = await db.query(query, [testimonialId]);
    return result[0];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateTestimonialModel = async (
  testimonialId,
  testimonialData
) => {
  try {
    const query = `UPDATE testimonials SET message = ?, name = ?, testimonial_pic = ? WHERE testimonial_id = ?`;
    const values = [
      testimonialData.message,
      testimonialData.name,
      testimonialData.testimonialPic,
      testimonialId,
    ];
    const [result] = await db.query(query, values);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteTestimonialModel = async (testimonialId) => {
  try {
    const query = `DELETE FROM testimonials WHERE testimonial_id = ?`;
    const [result] = await db.query(query, [testimonialId]);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
