const Product = require('../Models/product')
const dotenv = require('dotenv');
const {connectDatabase} = require('../server');

const products = require('../data/products');

// setting dotenv
dotenv.config({path:'backend/config/.env'});

connectDatabase();
const seedProducts = async () => {
try {
    await Product.deleteMany();
    console.log("Products deleted");

    await Product.insertMany(products);
    console.log("Products inserted");

    process.exit();
} catch (error) {
    console.error(error);
    process.exit();
}
}

seedProducts();