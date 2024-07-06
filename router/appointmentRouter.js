import express from "express"
import { getAllAppointments, postAppointment, updateAppointmentStatus } from "../controller/appointmentController.js";
import { isAdminAuthenticated,isPatientAuthenticated } from "../middlewares/auth.js";

const router=express.Router();

router.post("/post",isPatientAuthenticated,postAppointment); // jo appointment post karega woh patient hona chahiye
router.get("/getall",isAdminAuthenticated,getAllAppointments);
router.put("/update/:id",isAdminAuthenticated,updateAppointmentStatus); // status ko update kar rhe hai


export default router;
