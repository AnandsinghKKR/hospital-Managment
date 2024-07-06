// isme hum loge, JWT token ko generate kar rhe hai , 

// iss generateToken() method mein kuch bhi parameter le sakte hai 

export const generateToken=(user,message,statusCode,res)=>{
    // ye jo user -> hai isme saare function hai jo iske schema mai define hai example -> ( generateJsonWebToken()  )
    const token=user.generateJsonWebToken();
    const cookieName=user.role=="Admin" ?"adminToken":"patientToken"

    res
    .status(statusCode)
    .cookie(cookieName,token,{
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRE * 24 * 60 *60 *1000),
        httpOnly:true,
    })
    .json({
        success:true,
        message,
        user,
        token
    });
};