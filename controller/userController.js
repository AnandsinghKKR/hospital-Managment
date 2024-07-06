import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {generateToken} from "../utils/jwtToken.js"
import cloudinary from "cloudinary"

export const patientRegister= catchAsyncErrors(async(req,res,next)=>{
    const {firstName, lastName,email,phone,password,gender,dob,nic,role}= req.body
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role){
        return next(new ErrorHandler("Please Fill Full Form ",400));
    }
    let user= User.findOne({email})
    if(user){
        return next(new ErrorHandler("User Already Registered ",400));
    }
    user=await User.create({firstName, lastName,email,phone,password,gender,dob,nic,role});

    generateToken(user,"User Registered Successfully !",200,res)
 /*   
 
इस पूरी जगह पर हम्म अब जेनरेटटोकन फंक्शन को कॉल करें

 res.status(200).json({
        success:true,
        message:"User Registered Successfully !"
    })
*/    
})

export const login=catchAsyncErrors(async(req,res,next)=>{
    const {email,password,confirmPassword,role}=req.body;
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Please Provide All Details",400));
    }
    if(password !== confirmPassword){
        return next(new ErrorHandler("Password and confirm Password do not match!",400));
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Password Or Email",400));
    }

// ab yha per ek mast cheez hui hai, jaise ab hum uss password ko kaise match karenge jisko humne Select:false, kardiya
// hai userSchema mai, toh iske liye humne user schema mai "comparepassword" ke naam se function banaya hai pehle hee
// aur uper syntax hai  "User.findOne({email}).select("+password")" aise nikal lenge user ko

    const isPasswordMatched = await user.comparepassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password Or Email",400));
    }
    if(role != user.role){
        return next(new ErrorHandler("User with this role not found !! ",400));
    }

    generateToken(user,"User Logged In Successfully",200,res);
 /*   
 
इस पूरी जगह पर हम्म अब जेनरेटटोकन फंक्शन को कॉल करें    
    res.status(200).json({
        success:true,
        message:"User Logged In Successfully"
    })

*/    
})

export const addNewAdmin = catchAsyncErrors(async(req,res,next)=>{
    const {firstName, lastName,email,phone,password,gender,dob,nic,role}= req.body;
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role){
        return next(new ErrorHandler("Please Fill Full Form ",400));
    }

    // check user==ADMIN  is already registered or not
    const isRegistered= await User.findOne({email})
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already registered `,400));
    }

    // now adding new Admin to the database
    const admin = await User.create({firstName, lastName,email,phone,password,gender,dob,nic,role:"Admin"});
     
    res.status(200).json({
        success:true,
        message:"New Admin Registered"
    })
})

export const getAllDoctors=catchAsyncErrors(async(req,res,next)=>{
    const doctors= await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors
    });
})

export const getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user,
    })
})

export const logoutAdmin=catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{
        httpOnly:true,
        expires:new Date(Date.now())
    }).json({
        success:true,
        message:"user Logged Out"
    })
})

export const logoutPatient=catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{
        httpOnly:true,
        expires:new Date(Date.now())
    }).json({
        success:true,
        message:"user Logged Out"
    })
})

export const addNewDoctor=catchAsyncErrors(async(req,res,next)=>{
    if(!req.files || object.keys(req.files).length==0){
        return next(new ErrorHandler("Doctor Avatar is required",400));
    }
    const {docAvatar}=req.files;
    const allowedFormats=["image/png","image/jpeg","image/webp"]

    // mimetype is used to match the extension like png,jpg etc
    if (!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("file format not supported !",400));
    }
    const {firstName, lastName,email,phone,password,gender,dob,nic,doctorDepartment}= req.body;
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment){
        return next(new ErrorHandler("Please provide Full details!",400))
    }
    const isRegistered=await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} already Registered with this email`,400))
    }

    // now posting image on Cloudinary
    const cloudinaryResponse=await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error :",cloudinaryResponse.error || "Unknown Cloudinary Error")
    }

    const doctor= await User.create({firstName, lastName,email,phone,password,gender,dob,nic,
        doctorDepartment,role:"Doctor", docAvatar:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        } })
    res.status(200).json({
        success:true,
        message:"New Doctor Registered !",
        doctor
    })    
})