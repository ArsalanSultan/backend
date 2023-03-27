const express = require("express");
const router = express.Router();
const {
  deleteProduct,
  updateProduct,
  getProductById,
  getProducts,
  newProduct,
  
} = require("../controllers/productcontroller");
const {  isLoggedIn } = require("../middlewares/auth");

router.get(
  "/products", 
  getProducts
  );
router.get(
  "/product/:id", 
  getProductById
  );
router.post(
  "/admin/product/new",
  isLoggedIn,
  newProduct
);
router.put(
  "/admin/product/:id",
  isLoggedIn,
  updateProduct
);
router.delete(
  "/admin/product/:id",
  isLoggedIn,
  deleteProduct
);


module.exports = router;
