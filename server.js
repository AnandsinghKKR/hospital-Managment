import app from './app.js'
import cloudinary from 'cloudinary'
import messageRouter from './router/messageRouter.js'
import userRouter from './router/userRouter.js'


cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    api_key:process.env.CLOUDINARY_API_KEY
})

app.use("/api/v1/message",messageRouter);            // for message route
app.use("/api/v1/user",userRouter); 

app.listen(process.env.PORT,()=>{
console.log(`Server is running at port ${process.env.PORT}`)
})