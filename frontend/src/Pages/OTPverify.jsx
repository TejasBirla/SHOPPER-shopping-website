import React, { useState, useRef, useEffect } from "react";
import "./CSS/OTPverify.css";
import { useNavigate } from "react-router-dom";

export default function OTPverify() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(120);
  const email = sessionStorage.getItem("email");
  const [resendTrigger, setResendTrigger] = useState(0);


  useEffect(() => {
    const existingExpiry = localStorage.getItem("otpExpiry");
    const now = Date.now();

    if (existingExpiry) {
      const remaining = Math.floor((existingExpiry - now) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
      } else {
        setTimer(0);
        localStorage.removeItem("otpExpiry");
      }
    } else {
      const newExpiry = now + 2 * 60 * 1000; // 2 minutes from now
      localStorage.setItem("otpExpiry", newExpiry);
      setTimer(120);
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          localStorage.removeItem("otpExpiry");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [resendTrigger]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    setError("");
    setMessage("");

    if (element.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const OTP_api_call = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/verifycode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("OTP verified successfully. Redirecting...");
        setError("");
        setTimeout(() => {
          navigate("/resetpassword");
        }, 2000);
      } else {
        setError(
          data.message || "Invalid or expired OTP. Please request a new one."
        );
        setMessage("");
        setOtp(new Array(6).fill(""));
        inputsRef.current[0].focus();
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again.");
    }
  };

  const handleResetOTP = async () => {
    let response = await fetch("http://localhost:4000/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    let data = await response.json();
    if (data.success) {
      setMessage(data.message);
      setError("");
      const newExpiry = Date.now() + 2 * 60 * 1000;
      localStorage.setItem("otpExpiry", newExpiry);
      setTimer(120);
       setResendTrigger((prev) => prev + 1); 
    } else {
      setError(data.message);
      setMessage("");
      setOtp(new Array(6).fill(""));
      inputsRef.current[0].focus();
    }
  };

  return (
    <div className="otp">
      <div className="otp-container">
        <h1>OTP Verification</h1>
        <div className="otp-fields">
          <div className="otp-container-box">
            {otp.map((data, index) => (
              <input
                className="otp-boxes"
                type="text"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
              />
            ))}
          </div>

          <div className="timer-container">
            {timer > 0 ? (
              <p className="timer-paragraph">
                Time Remaining: <span>{timer} sec</span>
              </p>
            ) : (
              <p className="timer-expired">
                ⏱️ OTP expired.{" "}
                <span className="resend-otp" onClick={handleResetOTP}>
                  Resend OTP?
                </span>
              </p>
            )}
          </div>

          <button onClick={OTP_api_call}>Submit</button>

          {message && <p className="otp-success">{message}</p>}
          {error && <p className="otp-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
