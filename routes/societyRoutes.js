import express from "express";
import {
  createSociety,
  deleteSocietbytId,
  getallsociety,
} from "../controllers/SocietyModule/society.model.js";

const router = express.Router();

router.post("/createsociety", createSociety);
router.get("/allsocieties", getallsociety);
router.delete("/deletesocietybyid/:id", deleteSocietbytId);

export default router;
