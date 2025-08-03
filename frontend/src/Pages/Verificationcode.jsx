import React, { useState, useEffect } from "react";
import "./CSS/Verificationcode.css";
import { useNavigate } from "react-router-dom";

export default function Verificationcode() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [OTPRequestDisabled, setOTPRequestDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const lastRequestTime = sessionStorage.getItem("otpRequestTime");
    if (lastRequestTime) {
      const now = Date.now();
      const elapsed = now - parseInt(lastRequestTime, 10);

      if (elapsed < 300000) {
        setOTPRequestDisabled(true);
        setTimeout(() => {
          setOTPRequestDisabled(false);
          sessionStorage.removeItem("otpRequestTime");
        }, 300000 - elapsed); // wait for remaining time
      } else {
        setOTPRequestDisabled(false);
        sessionStorage.removeItem("otpRequestTime");
      }
    }
  }, []);

  const handleInput = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const validateForm = async () => {
    if (!email.trim()) {
      setError("Email ID is required.");
      setEmail("");
      setMessage("");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setMessage("");
      return;
    }
    if (OTPRequestDisabled) {
      setError("You can request a new OTP after 5 minutes.");
      return;
    }

    try {
      let response = await fetch(
        "http://localhost:4000/api/users/sendcode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      let data = await response.json();
      console.log(data);
      if (data.success) {
        setMessage(
          "A verification code has been sent to your email address. Please check your inbox."
        );
        setError("");
        sessionStorage.setItem("email", email);

        setOTPRequestDisabled(true);

        setTimeout(() => {
          setOTPRequestDisabled(false);
        }, 300000);

        setTimeout(() => {
          navigate("/otpverify");
        }, 3000);
      } else {
        setError(data.message);
        setMessage("");
      }
    } catch {
      console.log("Error occur");
    }
  };
  return (
    <div className="verificationcode">
      <div className="verificationcode-container">
        <h1>Email verification</h1>
        <div className="verificationcode-fields">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={handleInput}
          />
          <p className="info-message">
            Enter your email address to get the verification code.
          </p>
          <button onClick={validateForm} disabled={OTPRequestDisabled}>
            Verify
          </button>
          {message ? (
            <p className="verification-success">{message}</p>
          ) : (
            <p className="verification-error">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
