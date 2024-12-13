import express from "express";
import {
  createAddress,
  deleteAddressById,
  editAddressById,
  getAddressByAddressId,
  getAddressById,
  getAllAddress,
} from "../controllers/addressModule/address.controller.js";

const router = express.Router();

router.post("/create/address", createAddress);
router.get("/getAllAddresses", getAllAddress);
router.get("/getAddressById/:userId", getAddressById);
router.get("/getAddressByAddressId/:addressId", getAddressByAddressId);
router.put("/updateAddressById/:address_id", editAddressById);
router.delete("/deleteAddressById/:addressId", deleteAddressById);

export default router;
