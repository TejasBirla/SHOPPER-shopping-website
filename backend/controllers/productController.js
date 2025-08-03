import Product from "../models/Product.js";
import Users from "../models/Users.js";
import sendMail from "../utils/sendMail.js";

export const addProduct = async (req, res) => {
  const products = await Product.find({});
  let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const product = new Product({
    id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  res.json({ success: true, name: req.body.name });
};

export const removeProduct = async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
};

export const getAllProducts = async (req, res) => {
  const allProduct = await Product.find({});
  res.json({ success: true, allProduct });
};

export const getNewCollections = async (req, res) => {
  const products = await Product.find({});
  const newCollection = products.slice(-8);
  res.send(newCollection);
};

export const getPopularInWomen = async (req, res) => {
  const products = await Product.find({ category: "Women" });
  const popularProducts = products.slice(0, 4);
  res.send(popularProducts);
};

export const newsletterSubscription = async (req, res) => {
  const userEmail = req.body.email;
  if (!userEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const subject = "Subscription Successful!";
    const text = "Thank you for subscribing to our newsletter!";
    await sendMail(userEmail, subject, text);

    res.json({
      success: true,
      message: "Subscription email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemID] += 1;

    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    res.status(200).json({ success: true, message: "Item added to cart." });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemID] = 0;

    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    res.status(200).json({ success: true, message: "Item removed from cart." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
