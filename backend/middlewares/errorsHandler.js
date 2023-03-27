// const { stack } = require('../app');
const ErrorHandler = require('../utils/errorHandler');

const errorsHandler=(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
if(process.env.NODE_ENV === 'DEVELOPMENT'){
    res.status(err.statusCode).json({
        sucess:false,
        error:err,
        errmessage:err.message,
        stack:err.stack

    });
}

     if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = { ...err } 

        error.message = err.message;

          //wrong mongoose object id error
          if(err.name === "CastError"){
            const message =  `Resource not found.Invalid ${err.path}`;
            error = new  ErrorHandler(message, 400)
          }

          //Handling mongoose validation error
          if(err.name === "ValidationError"){
            const message = Object.values(err.errors).map(value=>value.message)
            error = new ErrorHandler(message,400)
          }

          // handling mongoose duplicate key error
          if(err.code === 11000){
            const message = `duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message,400)
          }

 
          //Handling wrong jwt error
          if(err.name==='JsonWebTokenError'){
            const message = `json web token is invalid`
            error = new ErrorHandler(message,400)
          }
          //handling expired jwt error
          if(err.name==='TokenExpiredError'){
            const message = `json web token is expired`
            error = new ErrorHandler(message,400)
          }

        res.status(error.statusCode).json({
            success:false,
            message:error.message || 'Internal Server Error',
        })
     }
   
}

exports.errorsHandler=errorsHandler;