import express from "express"
import { postAppointment } from "../controller/appointmentController";
const router=express.Router();

router.post("/post",postAppointment);

export default router;
