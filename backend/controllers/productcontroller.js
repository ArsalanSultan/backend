const Product = require("../Models/product");
const ErrorHandler = require("../utils/errorHandler");

const APIFeatures = require("../utils/functionalities");
const cloudinary = require("cloudinary");
//create a new product =>api/v1/product/new

const newProduct = async (req, res, next) => {
  try {
 
  // req.body.user =  req.body.id;
  const { name, price, description, brand, seller, stock } = req.body;

  const result = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "Products",
    width: 150,
    crop: "scale",
  });
  const product = await Product.create({
    name,
    price,
    description,
    brand,
    seller,
    stock,
    images: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });
  //   const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  })
} catch (error) {
    res.send(error)
};
};

//get single product =>api/v1/product/:id

const getProductById = async (req, res, next) => {
  try {
    
  
  const product = await Product.findById(req.params.id);
  if (!product) {
    next(new ErrorHandler("Product not found", 404));
  } else {
    res.status(200).json({
      success: true,
      product,
    });
  }
} catch (error) {
    res.send(error)
}
};

//getall the products => api/vi/products
const getProducts = async (req, res, next) => {
  try {
    
  
  const resPerpage = 11;
  productsCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerpage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    productsCount,
    resPerpage,
    products,
  });
} catch (error) {
    res.send(error)
}
};

//update product =>api/v1/admin/product/:id

const updateProduct = async (req, res, next) => {
  try {
   
  //let product = await Product.findById(req.params.id);
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!product) {
    next(new ErrorHandler("Product not found", 404));
  } else {
    res.status(200).json({
      success: true,
      product,
    });
  }
   
} catch (error) {
    res.send(error)
}
};
// delete product =>api/v1/admin/product/:id

const deleteProduct = async (req, res, next) => {
  try {
   
  const product = await Product.findByIdAndRemove(req.params.id);
  if (!product) {
    next(new ErrorHandler("Product not found", 404));
  } else {
    res.status(200).json("product has been deleted");
  }
   
} catch (error) {
    res.send(error)
}
};


exports.newProduct = newProduct;
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
