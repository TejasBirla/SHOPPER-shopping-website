import express from "express";
import {
  addProduct,
  removeProduct,
  getAllProducts,
  getNewCollections,
  getPopularInWomen,
  newsletterSubscription,
  addToCart,
  removeFromCart,
} from "../controllers/productController.js";
import authenticateToken from "../middleware/auth.js";

const productRoute = express.Router();

productRoute.post("/addproduct", addProduct);
productRoute.post("/removeproduct", removeProduct);
productRoute.get("/allproducts", getAllProducts);
productRoute.post("/addtocart", authenticateToken, addToCart);
productRoute.post("/removetocart", authenticateToken, removeFromCart);
productRoute.get("/newcollections", getNewCollections);
productRoute.get("/popularinwomen", getPopularInWomen);
productRoute.post("/newsletter", authenticateToken, newsletterSubscription);

export default productRoute;
