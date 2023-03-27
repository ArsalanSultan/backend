const User = require("../Models/user");

const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const jwtToken=(user,statusCode,res) =>{
 
  //generate jwt token

  const accessToken = user.getJwtToken();

    //const {password, ...info} = user._doc;
      //res.status(200).json(info);

  res.status(statusCode).json({ accessToken, user})

}


// register user
const registerUser = async(req,res,next) =>{
  try {
   
  const photo = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'avatars',
    width: 150,
    crop: "scale"
})

const { name, email, password } = req.body;

const user = await User.create({
    name,
    email,
    password,
    avatar: {
        public_id: photo.public_id,
        url: photo.secure_url
    }
})

jwtToken(user, 200, res)


 
} catch (error) {
    return res.status(400).json(error)
}


}


// const registerUser = async (req, res, next) => {
//   try {
//     // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
//     //   folder: "avatars",
//     //   width: 150,
//     //   crop: "scale",
//     // });

//     const { name, email, password } = req.body;

//     const emailVerificationToken = crypto.randomBytes(20).toString("hex");
//     const emailVerificationTokenExpiry = Date.now() + 3600000; // 1 hour

//     const user = await User.create({
//       name,
//       email,
//       password,
//       avatar: {
//         public_id: 'hwge',//result.public_id,
//         url:'edjbwjkbkx' //result.secure_url,
//       },
//       emailVerified: false,
//       emailVerificationToken,
//       emailVerificationTokenExpiry,
//     });
 
//     const verificationUrl = `http://localhost:3000/verify-email?${emailVerificationToken}`;
//     const message = `Please click on the following link to verify your email address:\n\n${verificationUrl}\n\nIf you have not requested this email then ignore it.`;
 
//       await sendEmail({ email, subject: "Email Verification", message });
//       res.send({ message: "Plase Verify your email" });
   
//     jwtToken(user, 200, res);
//   } catch (error) {
//     res.status(400).json(error);; //
//   }
// };

// register user with google account => api/v1/register/google

const registerUserWithGoogle = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
    });

    jwtToken(user, 200, res);
  } catch (error) {
    res.send(error);
  }
};

//login user => api/v1/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check if user has entered email and password
    if (!email || !password) {
      return res.status(400).json('please enter email & password')
      
    }
    //finding user db
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(401).json('invalid email & password')
    }

    //checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json('invalid email & password')
    } else {
     
      jwtToken(user, 200, res);
    }
  } catch (error) {
    res.send(error);
  }
};

//login user=>api/v1/admin/login

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check if user has entered email and password
    if (!email || !password) {
      return res.status(400).json('please enter email & password')
     
    }
    //finding user db
    const user = await User.findOne({ email })
    //console.log(user,'user')

    if (!user) {
      return res.status(401).json('Invalid Email or password')
      
    }
    // checks role of the user
    const usser = await User.findOne({ email });
    //console.log(usser,'usser')
    if (usser.role !== "admin") {
      return res.status(401).json('User is not admin')

    }

    //checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json('Invalid Email or password')
    } else {
      // assign token to user
      jwtToken(user, 200, res);
    }
  } catch (error) {
    res.send(error);
  }
};

// forgot password => api/v1/password/forgot
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json('Invalid Email')
    }
    const resetToken = user.getResetPassToken();

    await user.save({ validateBeforeSave: false });

    //create reset Password url

    //const resetUrl= `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    const resetUrl = `http://localhost:3000/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email then ignore it `;
    try {
      await sendEmail({
        email: req.body.email,
        subject: "Password Recovery Email",
        message,
      });
      res.status(200).json({
        success: true,
        message: "Please Follow the instructions sent to you in email",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    res.send(error);
  }
};

// reset Password => api/v1/password/reset/:token
const resetPassword = async (req, res, next) => {
  try {
    //Hash URL token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(
        new ErrorHandler("password reset token is invalid or expires", 400)
      );
    }
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
    }

    //setup new password
    user.password = req.body.password;

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    res.send(error);
  }
};

// get currenttly logged in user => api/v1/me
const getActiveUser = async (req, res, next) => {
  try {
    // console.log("req === ",req.user)
    const user = await User.findById(req.user.id);

    jwtToken(user, 200, res);
  } catch (error) {
    res.send(error);
  }
};

//change user password => /api/v1/password/update
const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    // check previous user  password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
      return next(new ErrorHandler("old password is incorrect", 400));
    } else {
      user.password = req.body.password;

      await user.save();

      jwtToken(user, 200, res);
    }
  } catch (error) {
    res.send(error);
  }
};

//update user profile => /api/v1/me/update

const updateProfile = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    console.log("User id", req.body.id);
    console.log("User Data", newUserData);
    // update avatar
    if (req.body.avatar !== "") {
      const user = await User.findById(req.body.id);
      const image_id = user.avatar.public_id;

      const res = await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(req.body.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json(
      {
        success: true,
      },
      user
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.send(error);
  }
};

//admin routes

//get all users => /api/v1/admin/users

const allUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.send(error);
  }
};
//get eny user with id => /api/v1/admin/user/ id

const userDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User is not found", 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.send(error);
  }
};

//update userinfo => api/v1/admin/user/:id
const updateUser = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.send(error);
  }
};

//deleteuser with id => /api/v1/admin/user/id

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User is not found", 404));
    }

    await user.remove();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.registerUser = registerUser;
exports.registerUserWithGoogle = registerUserWithGoogle;
exports.loginUser = loginUser;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.getActiveUser = getActiveUser;
exports.changePassword = changePassword;
exports.updateProfile = updateProfile;
exports.allUsers = allUsers;
exports.userDetail = userDetail;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.loginAdmin = loginAdmin;
