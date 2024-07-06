import mongoose from 'mongoose'

export const dbConnection=()=>{
    mongoose.connect(
        process.env.MONGO_URI,{
            dbName:"MERN_STACK_HOSPITAL_MANAGEMENT"
        }
    ).then(()=>{console.log("Database Connection is Successful")}
).catch((e)=>{console.log(e)})
}