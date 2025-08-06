import Users from "../models/Users.js";
import Order from "../models/Order.js";
import VerificationCode from "../models/VerificationCode.js";
import generateToken from "../utils/generateToken.js";
import sendMail from "../utils/sendMail.js";

export const signup = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      success: false,
      errors: {
        username: "Username is required.",
        email: "Email is required.",
        password: "Password is required.",
      },
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      errors: { email: "Invalid email format." },
    });
  }

  let check = await Users.findOne({ email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: { email: "Existing user found with same email address." },
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      errors: { password: "Password must be at least 6 characters long." },
    });
  }

  const cart = {};
  for (let i = 1; i < 100; i++) cart[i] = 0;

  const user = new Users({ name: username, email, password, cartData: cart });
  await user.save();

  const token = generateToken(user);

  const subject = "Welcome to Shopper!";
  const text = `Hello ${username},\n\nThank you for signing up at Shopper. We're excited to have you on board!`;

  sendMail(email, subject, text);
  res.json({ success: true, token });
};

export const login = async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      success: false,
      errors: { email: "Wrong email address." },
    });
  }

  const passCompare = req.body.password === user.password;
  if (!passCompare) {
    return res.status(400).json({
      success: false,
      errors: { password: "Wrong password." },
    });
  }

  const token = generateToken(user);

  const subject = "Login Successful!";
  const text = `Hello ${user.name},\n\nYou have successfully logged in to Shopper. Enjoy shopping!`;

  sendMail(user.email, subject, text);
  res.json({ success: true, token });
};

export const sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email address is required. Please provide a valid email.",
    });
  }

  try {
    const existingUser = await Users.findOne({ email });
    if (!existingUser) {
      return res.json({
        success: false,
        message: "This email is not registered. Please signup first.",
      });
    }

    const lastOtpRequest = await VerificationCode.findOne({ email }).sort({
      createdAt: -1,
    });

    if (lastOtpRequest && Date.now() - lastOtpRequest.createdAt < 300000) {
      return res.json({
        success: false,
        message:
          "You can only request a new OTP every 5 minutes. Please try again later.",
      });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("Code created:", code);
    const newCode = new VerificationCode({ email, code });
    await newCode.save();
    
    const subject = "Password Reset Verification Code - Shopper";
    const text = `Dear user,\n\nYour verification code for resetting your password is: ${code}\n\nPlease note that this code is valid for 2 minutes.\n\nIf you did not request this, please ignore this email.\n\nThank you,\nTeam Shopper`;
    
    sendMail(email, subject, text);
    
    return res.json({
      success: true,
      message:
      "A verification code has been sent to your email address. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error occurred while sending verification code:", error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.json({
      success: false,
      message: "Email and verification code is required.",
    });
  }
  
  try {
    const record = await VerificationCode.findOne({ email, code });
    if (!record) {
      return res.json({
        success: false,
        message: "Invalid verification code.",
      });
    }
    
    const codeCreationTime = record.createdAt;
    const currentTime = Date.now();
    const timeDifference = (currentTime - codeCreationTime) / 1000;
    
    if (timeDifference > 120) {
      return res.json({
        success: false,
        message:
        "Verification code is expired. Please request for new verification code.",
      });
    }
    
    return res.json({
      success: true,
      message: "Verification successful. You may now reset your password.",
    });
  } catch (error) {
    console.log("Error occur: ", error);
    return res.json({
      success: false,
      message: "Server error try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  
  if (!email || !newPassword) {
    return res.json({
      success: false,
      message: "Email and password are required.",
    });
  }
  
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "No account found with the provided email.",
      });
    }
    
    user.password = newPassword;
    await user.save();
    
    return res.json({
      success: true,
      message: "Password has been successfully reset.",
    });
  } catch (error) {
    console.log("Error occur: ", error);
    return res.json({
      success: false,
      message: "Server error please try again.",
    });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.json({
      success: false,
      message: "Email address is required. Please provide a valid email.",
    });
  }
  
  try {
    const existingUser = await Users.findOne({ email });
    if (!existingUser) {
      return res.json({
        success: false,
        message: "This email is not registered. Please signup first.",
      });
    }
    
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("RESET Code created:", code);
    const newCode = new VerificationCode({ email, code });
    await newCode.save();

    const subject = "Password Reset Verification Code - Shopper";
    const text = `Dear user,\n\nYour new verification code for resetting your password is: ${code}\n\nPlease note that this code is valid for 2 minutes.\n\nIf you did not request this, please ignore this email.\n\nThank you,\nTeam Shopper`;

    sendMail(email, subject, text);

    return res.json({
      success: true,
      message:
        "A new verification code has been sent to your email address. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error occurred while resending verification code:", error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userID: req.user.id })
      .populate("products.productID")
      .sort({ orderDate: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const fetchCart = async (req, res) => {
  try {
    const userData = await Users.findOne({ _id: req.user.id });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};
