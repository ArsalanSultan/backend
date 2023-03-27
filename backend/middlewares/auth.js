
const User = require('../Models/user');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken')
//checks if user is logged in or not

const isLoggedIn = async (req,res,next)=>{
    try {
     
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
    
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
            if(err) {res.status(403).json("token is not valid")}
            else{
            req.user = user;
            next();}
        });
    }else{
        return res.status(401).json("You are not authenticated");
    }

   
} catch (error) {
        res.send(error)
}


}



exports.isLoggedIn = isLoggedIn;