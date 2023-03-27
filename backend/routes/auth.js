const express = require("express");
const router = express.Router();

const {
  registerUser,
  registerUserWithGoogle,
  loginUser,
  loginAdmin,
  forgotPassword,
  resetPassword,
  getActiveUser,
  changePassword,
  updateProfile,
  allUsers,
  userDetail,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const { isLoggedIn } = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/register/google", registerUserWithGoogle);
router.post("/login", loginUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isLoggedIn, getActiveUser);
router.put("/password/update", isLoggedIn, changePassword);
router.put("/me/update", isLoggedIn, updateProfile);

router.get("/admin/users", isLoggedIn,  allUsers);
router.get("/admin/user/:id", isLoggedIn,  userDetail);
router.put("/admin/user/:id", isLoggedIn,  updateUser);

router.delete(
  "/admin/user/:id",
  isLoggedIn,
  deleteUser
);
router.post("/admin/login", loginAdmin);

module.exports = router;
