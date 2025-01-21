import express from "express";
import {
  createModel,
  getAllCombosController,
  getComboByIdController,
  updateComboController,
  deleteComboController,
  getParentCombosController
} from "../controllers/comboModule/comboController.js";
import upload from "../config/multer.js";
const router = express.Router();

router.post("/createCombo", upload.array("product_image[]"),createModel); 
router.get("/getAllCombos", getAllCombosController); 
router.get("/getparentCombo/:id", getParentCombosController); 
router.get("/getCombo/:id", getComboByIdController); 
router.put("/updateCombo/:id", upload.array("product_image"), updateComboController); 
router.delete("/deleteCombo/:id", deleteComboController); 

export default router;
