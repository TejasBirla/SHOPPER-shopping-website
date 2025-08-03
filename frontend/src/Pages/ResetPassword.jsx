import React, { useState } from "react";
import "./CSS/ResetPassword.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const email = sessionStorage.getItem("email");

  const handlePassword = (event) => {
    setNewPassword(event.target.value);
    setError("");
    setMessage("");
  };

  const confirmPass = (event) => {
    setConfirmPassword(event.target.value);
    setError("");
    setMessage("");
  };

  const changePassword = async () => {
    if (!newPassword || !confirmPassword) {
      return setError("Both password fields are required.");
    }

    if (newPassword.length < 6) {
      return setError("The new password must be at least 6 characters long.");
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      return setError("The passwords entered do not match.");
    }

    try {
      const response = await fetch(`${BASE_URL}/api/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Your password has been successfully reset.");
        setError("");
        setNewPassword("");
        setConfirmPassword("");
        sessionStorage.removeItem("email");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Unable to reset password. Please try again.");
        setMessage("");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("A server error occurred. Please try again later.");
    }
  };

  return (
    <div className="resetpassword">
      <div className="resetpassword-container">
        <h1>Reset Password</h1>
        <div className="resetpassword-fields">
          <input type="email" value={email} disabled readOnly />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={handlePassword}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={confirmPass}
          />
          <button onClick={changePassword}>Change Password</button>
          {message && <p className="reset-success">{message}</p>}
          {error && <p className="reset-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
