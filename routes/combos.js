import express from "express";
import {
  createModel,
  getAllCombosController,
  getComboByIdController,
  updateComboController,
  deleteComboController,
} from "../controllers/comboModule/comboController.js";

const router = express.Router();

router.post("/createCombo", createModel); 
router.get("/getAllCombos", getAllCombosController); 
router.get("/getCombo/:id", getComboByIdController); 
router.put("/updateCombo/:id", updateComboController); 
router.delete("/deleteCombo/:id", deleteComboController); 

export default router;
