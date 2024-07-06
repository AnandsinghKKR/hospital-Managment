import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First Name Must Contain At Least 3 Characters!"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
      maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    },
    nic: {
      type: String,
      required: true,
      minLength: [12, "NIC Must Contain At Least 12 Characters!"],
      maxLength: [12, "NIC Must Contain At Least 12 Characters!"],
    },
    dob:{
        type:Date,
        required:[true,"DOB is required"]
    },
    gender:{
        type:String,
        required:true,
        enum:["Male" , "Female"]
    },
    password:{
        type:String,
        minLength:[8,"Password Must Contain Atleast 8 Characters !!"],
        required:true,
        select: false                         // during getting details of user we have all other details , except password
    },
    role:{
        type:String,
        required:true,
        enum:["Admin", "Patient", "Doctor"]
    },
    doctorDepartment:{
        type:String
    },
    docAvatar:{
        public_id:String,
        url:String
    }
  });
  

// iska matlab hai user ke save hone se phele (pre) ,uska password bcrypt karlo 
  userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password= await bcrypt.hash(this.password,10)
  })


  // Jab hum login karenge tab password kaise compare hoga hashed password ke saath , isliye ye method use hoga
  userSchema.methods.comparePassword= async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password);
  }

// generate token , when user logged in
userSchema.methods.generateJsonWebToken= function(){
  return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY,{
    expiresIn:process.env.JWT_EXPIRES
  });
}

  export const User = mongoose.model("User", userSchema);