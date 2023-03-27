//create and send token and save in the coookie

const sendToken=(user,statusCode,res) =>{
 
    //generate jwt token

    const accessToken = user.getJwtToken();

    // // options for cookie
    // const options={
    //     expires:
    //         Date.now()+ process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    //     ,
    //     httpOnly:true
    // }
    // cookie('token',accessToken,options).

    res.status(statusCode).json({
        success:true,
        accessToken,
        user
    })

}

module.exports = sendToken;