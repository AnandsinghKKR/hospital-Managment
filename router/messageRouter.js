import express from'express'
import { getAllMessages, sendMessage } from '../controller/messageController.js';
import { isAdminAuthenticated } from "../middlewares/auth.js"


const router=express.Router();

router.post("/send",sendMessage)    // request post karne se pehle sendMessage controller run hoga "to check all the fields"

router.get("/getall",isAdminAuthenticated, getAllMessages);


export default router;