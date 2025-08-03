import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShopContext } from "../../Contexts/ShopContext.jsx";
import "./Payment.css";

export default function Payment() {
  const { finalizeShopperPayment } = useContext(ShopContext);
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const finalize = async () => {
      const orderIdFromURL = searchParams.get("order_id");
      if (!orderIdFromURL) {
        setStatus("error");
        return;
      }

      const storedData = JSON.parse(
        localStorage.getItem("shopper_payment_data")
      );
      const alreadyVerified = localStorage.getItem("already_verified");

      // If already verified this orderId, don't repeat
      if (alreadyVerified === orderIdFromURL) {
        setStatus("success");
        setTimeout(() => navigate("/myorders"), 2000);
        return;
      }

      setStatus("loading");
      await new Promise((res) => setTimeout(res, 1000)); // optional delay

      const result = await finalizeShopperPayment();

      if (result.success) {
        setStatus("success");
        localStorage.setItem("already_verified", orderIdFromURL);
        setTimeout(() => navigate("/myorders"), 2000);
      } else {
        setStatus("error");
      }
    };

    finalize();
  }, [finalizeShopperPayment, navigate, searchParams]);

  return (
    <div className="payment-status-page">
      {status === "loading" && (
        <div className="loading-msg">
          <p>⏳ Verifying your payment...</p>
        </div>
      )}
      {status === "success" && (
        <div className="success-msg">
          <h2>✅ Payment Successful</h2>
          <p>Redirecting to your orders...</p>
        </div>
      )}
      {status === "error" && (
        <div className="error-msg">
          <h2>❌ Payment Verification Failed</h2>
          <p>
            If you were charged, your order might still be created. Check My
            Orders.
          </p>
        </div>
      )}
    </div>
  );
}
