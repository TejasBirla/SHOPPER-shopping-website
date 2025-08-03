import Order from "../models/Order.js";
import axios from "axios";
import Users from "../models/Users.js";

export const initiatePayment = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const order_id = "order_" + Date.now();

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id,
        order_amount: totalAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: req.user.id,
          customer_email: req.user.email,
          customer_name: req.user.name,
          customer_phone: "9999999999",
        },

        order_meta: {
          return_url: `${process.env.FRONTEND_URL}/payment/success?order_id=${order_id}`,
        },
      },
      {
        headers: {
          accept: "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const { payment_session_id } = response.data;

    res.status(200).json({
      success: true,
      paymentSessionId: payment_session_id,
      orderId: order_id,
    });
  } catch (err) {
    console.error("Cashfree init error:", err?.response?.data || err.message);
    res.status(500).json({ success: false, message: "Payment init failed" });
  }
};

export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const { orderId, products, totalAmount } = req.body;

    // Verify payment with Cashfree
    const verifyRes = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          accept: "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        },
      }
    );

    if (verifyRes.data.order_status !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful. Order not created.",
      });
    }

    const orderedProducts = products.map((product) => ({
      productID: product._id,
      quantity: product.quantity,
      price: product.new_price,
    }));

    console.log(orderedProducts);

    const existingOrder = await Order.findOne({ orderId });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        order: existingOrder,
      });
    }

    const newOrder = await Order.create({
      userID: req.user.id,
      products: orderedProducts,
      totalAmount,
      paymentStatus: "PAID",
      orderId,
    });

    await Users.findByIdAndUpdate(req.user.id, { cartData: {} });

    res.status(201).json({
      success: true,
      message: "Order created after payment",
      order: newOrder,
    });
  } catch (error) {
    console.error("Verify payment error:", error.message);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};
