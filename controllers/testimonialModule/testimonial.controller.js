import {
  createTestimonialModel,
  deleteTestimonialModel,
  getAllTestimonialsModel,
  getTestimonialByIdModel,
  updateTestimonialModel,
} from "../../models/testimonial.model.js";
import cloudinary from '../../config/cloudinary.js'

export const addTestimonial = async (req, res) => {
  try {
    const { userId, message, name, city } = req.body;
    const testimonialPic = req.file;

    if (!message || !name || !city) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    let testimonialPicUrl = null;

    if (testimonialPic) {
      const result = await cloudinary.uploader.upload(testimonialPic.path, {
        folder: 'testimonials',
      });

      testimonialPicUrl = result.secure_url;
    }

    const newTestimonial = {
      userId,
      message,
      name,
      city,
      testimonialPic: testimonialPicUrl,
    };

    const createdTestimonial = await createTestimonialModel(newTestimonial);

    return res.status(201).json({
      message: "Testimonial added successfully",
      testimonial: createdTestimonial,
    });
  } catch (error) {
    console.log("addTestimonial Error", error);
    return res.status(500).json({message: "Internal Server Error",error: error.message});
  }
};


export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await getAllTestimonialsModel();
    return res.status(200).json(testimonials);
  } catch (error) {
    console.log("getTestimonials Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getTestimonialById = async (req, res) => {
  try {
    const { testimonialId } = req.params;
    const testimonial = await getTestimonialByIdModel(testimonialId);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    return res.status(200).json(testimonial);
  } catch (error) {
    console.log("getTestimonial Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


export const editTestimonialById = async (req, res) => {
  try {
    const { testimonialId } = req.params;
    const { message, name } = req.body;
    const testimonialPic = req.file;

    if (!message || !name) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    let testimonialPicUrl = null;

    if(testimonialPic) {
      const result = await cloudinary.uploader.upload(testimonialPic.path, {
        folder : 'testimonials'
      });

      testimonialPicUrl = result.secure_url;
    }

    const updatedTestimonial = { 
      message, 
      name,
      testimonialPic : testimonialPicUrl
    };
    await updateTestimonialModel(testimonialId, updatedTestimonial);

    return res.status(200).json({ message: "Testimonial updated successfully" });
  } catch (error) {
    console.log("editTestimonial Error", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteTestimonialById = async (req, res) => {
  try {
    const { testimonialId } = req.params;

    const testimonial = await getTestimonialByIdModel(testimonialId);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    await deleteTestimonialModel(testimonialId);

    return res
      .status(200)
      .json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.log("deleteTestimonial Error", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
