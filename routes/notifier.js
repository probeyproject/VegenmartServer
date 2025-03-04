import express from 'express';
import {deleteNotifybytId, getallnotify ,notifymodel} from "../controllers/NotifyModule/notify.model.js";

const router = express.Router();

router.get("/getallnotify",getallnotify);
router.post("/notifymodel",notifymodel);
router.delete("/notifydelete/:id",deleteNotifybytId)








export default router;
