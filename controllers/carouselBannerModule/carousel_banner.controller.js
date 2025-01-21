import cloudinary from '../../config/cloudinary.js'
import { createCarouselBannerModel, deleteCarouselBannerModel, getAllCarouselBannerModel, getCarouselBannerByIdModel, updateCarouselBannerModel } from '../../models/carousel_banner.model.js';
  
  export const createCarouselBanner = async (req, res) => {
    try {
      const { heading, offerHeading } = req.body;
      const carouselBannerPic = req.file;
  
      if (!heading || !offerHeading) {
        return res.status(400).json({ message: "All fields (heading, offerHeading) are required!" });
      }
  
      let carouselBannerPicUrl = null;
  
      if (carouselBannerPic) {
        const result = await cloudinary.uploader.upload(carouselBannerPic.path, {
          folder: 'carouselbanner',
        });
  
        carouselBannerPicUrl = result.secure_url;
      }
  
      const newCarouselBanner = {
        heading,
        offerHeading,
        carouselBannerPic: carouselBannerPicUrl,
      };
  
      const createdTestimonial = await createCarouselBannerModel(newCarouselBanner);
  
      return res.status(201).json({
        message: "Carousel Banner added successfully",
        testimonial: createdTestimonial,
      });
    } catch (error) {
      console.log("Carousel Banner Error", error);
      return res.status(500).json({message: "Internal Server Error",error: error.message});
    }
  };
  
  
  export const getAllCarouselBanner = async (req, res) => {
    try {
      const carouselBanner = await getAllCarouselBannerModel();
      if(!carouselBanner) {
        return res.status(500).json({ message: "Carousel Banner Not found " });
      }
      return res.status(200).json(carouselBanner);
    } catch (error) {
      console.log("Carousel Banner Error", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  export const getCarouselBannerById = async (req, res) => {
    try {
      const { carouselBannerId } = req.params;
      const carouselBanner = await getCarouselBannerByIdModel(carouselBannerId);
  
      if (!carouselBanner) {
        return res.status(404).json({ message: "Carousel Banner not found" });
      }
  
      return res.status(200).json(carouselBanner);
    } catch (error) {
      console.log("carouselBanner Error", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  
  export const updateCarouselBanner = async (req, res) => {
    try {
      const { carouselBannerId } = req.params;
      const { heading, offerHeading } = req.body;
      const carouselBannerPic = req.file;
  
      let carouselBannerPicUrl = null;
  
      if(carouselBannerPic) {
        const result = await cloudinary.uploader.upload(carouselBannerPic.path, {
          folder : 'carouselbanner'
        });
  
        carouselBannerPicUrl = result.secure_url;
      }
  
      const updatedCarouselBanners = { 
        heading, 
        offerHeading,
        carouselBannerPic : carouselBannerPicUrl
      };
      await updateCarouselBannerModel(carouselBannerId, updatedCarouselBanners);
  
      return res.status(200).json({ message: "Carousel Banner updated successfully" });
    } catch (error) {
      console.log("Carousel Banner Error", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  export const deleteCarouselBanner = async (req, res) => {
    try {
      const { carouselBannerId } = req.params;
  
      if (!carouselBannerId) {
        return res.status(404).json({ message: "Carousel Banner Id not found" });
      }
  
      await deleteCarouselBannerModel(carouselBannerId);
  
      return res.status(200).json({ message: "Carousel Banner deleted successfully" });
    } catch (error) {
      console.log("Carousel Banner  Error", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  