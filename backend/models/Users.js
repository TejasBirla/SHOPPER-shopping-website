import mongoose from "mongoose";

const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object, default: {} },
  Date: { type: Date, default: Date.now() },
});

export default Users;
