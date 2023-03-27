const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const dotenv = require('dotenv');
//setting config file
dotenv.config({path:'backend/config/.env'})

const products = require("./routes/product");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const { errorsHandler } = require("./middlewares/errorsHandler");
const order = require("./routes/order");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

// adding cors
app.use(cors());

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", payment);
app.use("/api/v1", order);

// middleware to handle errors
app.use(errorsHandler);

module.exports = app;
