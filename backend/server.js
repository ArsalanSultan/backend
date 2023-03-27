 const app = require('./app');
const dotenv = require('dotenv');
 const mongoose = require('mongoose');
 const cloudinary = require('cloudinary')

 
//setting config file
dotenv.config({path:'backend/config/.env'})

mongoose.set('strictQuery', true);



// SETTING UP CLOUDINARY

cloudinary.config({
   cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
   api_key : process.env.CLOUDINARY_API_KEY,
   api_secret : process.env.CLOUDINARY_API_SECRET
}) 



// const port = process.env.PORT || 3000;

const connectDatabase = () => {
   mongoose.connect(process.env.MONGO_URL).then(()=>{console.log('Connected to DB')}).catch((err)=>console.log(err))
}

connectDatabase();
 
//  const server =
  app.listen(process.env.PORT,()=>{
    console.log(`server started on port:${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
 });
 
//Handle Unhandled Promise Rejections
// process.on('unhandledRejection', (err) => {
//     console.log(`ERROR: ${err.message}`);
//     console.log(`shutting down server due to `);
//     server.close(() => {
//         process.exit(1);
//     });
   
//    })
    // application specific logging, throwing an error, or other logic here
    // console.log(reason);


 exports.connectDatabase = connectDatabase;

 // WtlH6EXyUl5mYwDu



 


 // First, you would want to know which process is using port 3000

// sudo lsof -i :3000
// this will list all PID listening on this port, once you have the PID you can terminate it with the following:

// kill -9 {PID}