// import mongoose from "mongoose";

// const Order = mongoose.model("Order", {
//   userID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Users",
//     required: true,
//   },
//   products: [
//     {
//       productID: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//       },
//       quantity: { type: Number, required: true },
//       price: { type: Number, required: true },
//     },
//   ],
//   totalAmount: { type: Number, required: true },
//   orderDate: { type: Date, default: Date.now },
//   paymentStatus: { type: String, default: "Pending" },
// });

// export default Order;

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate orders
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  products: [
    {
      _id: false, // 🟡 Optional: removes auto _id from each product item
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "PAID", "FAILED"],
  },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
