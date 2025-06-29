const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const { error, timeStamp } = require("console");
require("dotenv").config();
const app = express();
const PORT = 4000;

//built-in Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

// Product Schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now() },
  available: { type: Boolean, default: true },
});

// User Schema
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  Date: { type: Date, default: Date.now() },
});

// Order Schema
const Order = mongoose.model("Order", {
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  products: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }, // "Pending", "Completed", "Cancelled"
  paymentStatus: { type: String, default: "Pending" },
});

const VerificationCode = mongoose.model("VerificationCode", {
  email: { type: String, required: true },
  code: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 120 },
});

// JWT Token Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret_ecom");
    req.user = decoded.user;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Signup Route
app.post("/signup", async (req, res) => {
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
  for (let i = 1; i < 100; i++) {
    cart[i] = 0;
  }

  const user = new Users({
    name: username,
    email: email,
    password: password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
  const token = jwt.sign(data, "secret_ecom");

  const subject = "Welcome to Shopper!";
  const text = `Hello ${username},\n\nThank you for signing up at Shopper. We're excited to have you on board!`;

  sendMail(email, subject, text);
  res.json({ success: true, token });
});

// Login Route
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
      const token = jwt.sign(data, "secret_ecom");

      const subject = "Login Successful!";
      const text = `Hello ${user.name},\n\nYou have successfully logged in to Shopper. Enjoy shopping!`;
      sendMail(user.email, subject, text);

      res.json({ success: true, token });
    } else {
      res
        .status(400)
        .json({ success: false, errors: { password: "Wrong password." } });
    }
  } else {
    res
      .status(400)
      .json({ success: false, errors: { email: "Wrong email address." } });
  }
});

app.post("/send-verification-code", async (req, res) => {
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

    // Find the last OTP request for this email
    const lastOtpRequest = await VerificationCode.findOne({ email }).sort({
      createdAt: -1,
    });

    // If last OTP request exists and it was made less than 5 minutes ago, deny the request
    if (lastOtpRequest && Date.now() - lastOtpRequest.createdAt < 300000) {
      return res.json({
        success: false,
        message:
          "You can only request a new OTP every 5 minutes. Please try again later.",
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

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
});

app.post("/verifycode", async (req, res) => {
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
});

app.post("/reset-password", async (req, res) => {
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
});

app.post("/resend-otp", async (req, res) => {
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

    // Generate a new OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the new OTP to the database
    const newCode = new VerificationCode({ email, code });
    await newCode.save();

    // Send the OTP via email (or any other method)
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
});

// File Upload Route (Multer)
const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.use("/images", express.static("uploads/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`,
  });
});

// Add Product Route

app.post("/addproduct", async (req, res) => {
  const products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Remove Product Route
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Get All Products Route
app.get("/allproducts", async (req, res) => {
  const allProduct = await Product.find({});
  res.json({ success: true, allProduct: allProduct });
});

// Get New Collections Route
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newCollection = products.slice(-8);
  res.send(newCollection);
});

app.post("/newsletter", authenticateToken, async (req, res) => {
  const userEmail = req.body.email;
  if (!userEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Subscription Successful!",
      text: "Thank you for subscribing to our newsletter!",
    };
    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Subscription email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Get Popular Products for Women Route
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "Women" });
  let popularProducts = products.slice(0, 4);
  res.send(popularProducts);
});

// Get User Orders Route
app.get("/myorders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userID: req.user.id });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});

// Add to Cart Route
const fetchUser = async (req, res, next) => {
  let token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      console.log("Error occurred", error);
    }
  }
};

app.post("/addtocart", fetchUser, async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemID] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
});

//Remove to Cart Route
app.post("/removetocart", fetchUser, async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemID] = 0;

  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
});

app.get("/fetchcart", fetchUser, async (req, res) => {
  try {
    const userData = await Users.findOne({ _id: req.user.id });
    if (!userData) {
      res.status(404).send("User not found");
      return;
    }
    res.status(200).json({ cartData: userData.cartData || {} });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//email sending (SMTP)

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//function to send mail

const sendMail = (toEmail, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Email not send,an error occur: ", error);
    } else {
      console.log("Email sent", info.response);
    }
  });
};

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
