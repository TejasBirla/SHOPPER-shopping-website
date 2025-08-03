import mongoose from "mongoose";

const VerificationCode = mongoose.model("VerificationCode", {
  email: { type: String, required: true },
  code: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 120 },
});

export default VerificationCode;
