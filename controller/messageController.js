import {Message} from "../models/messageSchema.js"
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js"

export const sendMessage=catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,message}= req.body;
    // then we have to make model and store it nto database
    if(!firstName || !lastName || !email || !phone || !message){

        return next(new ErrorHandler("Please fill form !!",400)) 
        // console.log(req.body);
        // return res.status(400).json({
        //     success:false,                                               // //doing work of Middleware
        //     message:"Please fill the form Correctly "
        // })
    }
    await Message.create({firstName,lastName,email,phone,message});
        res.status(200).json({
        success:true,
        message:"Message send Successfully"
    })
})

export const getAllMessages=catchAsyncErrors(async(req,res,next)=>{
    const messages=await Message.find();
    res.status(200).json({
        success:true,
        messages
    })
})