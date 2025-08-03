import express from "express";
import {
  signup,
  login,
  sendVerificationCode,
  verifyCode,
  resetPassword,
  resendOtp,
  getMyOrders,
  fetchCart,
} from "../controllers/userController.js";
import authenticateToken from "../middleware/auth.js";

const userRoute = express.Router();

userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.post("/sendcode", sendVerificationCode);
userRoute.post("/verify-code", verifyCode);
userRoute.post("/reset-password", resetPassword);
userRoute.post("/resend-code", resendOtp);
userRoute.get("/myorders", authenticateToken, getMyOrders);
userRoute.get("/fetchcart", authenticateToken, fetchCart);

export default userRoute;
