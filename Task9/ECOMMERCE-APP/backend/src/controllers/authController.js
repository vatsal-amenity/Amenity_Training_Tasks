const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register new user and send otp
// @route Post /api/auth/register
// @access public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "please add all fields" });
    }

    //check if user exists or not
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "user already exists" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //genrate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; //10min

    //create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      otp,
      otpExpires,
      isVerified: false,
    });

    if (user) {
      const message = `Your OTP for saree app verification id: ${otp}. it has been expire in 10 minutes.`;

      try {
        await sendEmail({
          email: user.email,
          subject: "Account verification otp ",
          message,
        });
        res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          message: "Registration successful. please verify otp in your email.",
        });
      } catch (error) {
        await User.findByIdAndDelete(user.id);
        return res
          .status(500)
          .json({ message: "Email could not be sent, please try again." });
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verify OTP
//@route POSt /api/auth/verify
//@access public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "User already verified" });
    }
    //check otp matches and expierd or not
    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        message: "Account verified successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//forgot password
//@route post /api/auth/forgot-password
//@access public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }
    //generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hash token and set to resetpassword
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    //set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //10min

    await user.save();
    //create reset url
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const message = `you requested a password reset. please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//reset password
// @route PUT /api/auth/reset-password/:resetToken
// @access public
const resetPassword = async (req, res) => {
  try {
    //get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    //set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(400).json({ message: "Please verify your email first" });
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Toggle wishlist item
//@route PUT /api/auth/wishlist
//@access Private
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    //check if product is already in wishlist
    const isInWishlist = user.wishlist.some(id => id.toString() === productId);
    if (isInWishlist) {
      //remove from wishlist
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
      await user.save();
      res.json({ message: "Product removed from wishlist", wishlist: user.wishlist });
    } else {
      //add wishlist
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: "Product added to wishlist", wishlist: user.wishlist });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user wishlist
// @route GET /api/auth/wishlist
// @access Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyOtp, forgotPassword, resetPassword, loginUser, toggleWishlist, getWishlist };
