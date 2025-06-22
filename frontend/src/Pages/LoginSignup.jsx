import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/LoginSignup.css";

export default function LoginSignup() {
  const Navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    checkbox: "",
  });
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setCheckboxChecked(event.target.checked);

    setErrors((prevErrors) => ({
      ...prevErrors,
      checkbox: "",
    }));
  };

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [event.target.name]: "",
    }));
  };

  const validateForm = () => {
    const { username, email, password } = formData;
    let newErrors = { username: "", email: "", password: "", checkbox: "" };
    let isValid = true;

    if (state === "Signup" && !username) {
      newErrors.username = "Username is required.";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (state === "Signup" && !checkboxChecked) {
      newErrors.checkbox = "You must agree to the terms and conditions.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const loginFunction = async () => {
    if (!validateForm()) return;

    let responseData;
    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...responseData.errors,
      }));
    }
  };

  const signupFunction = async () => {
    if (!validateForm()) return;

    let responseData;
    await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...responseData.errors,
      }));
    }
  };

  const handleStateChange = (newState) => {
    setState(newState);
    setErrors({ username: "", email: "", password: "", checkbox: "" });

    setFormData({
      username: "",
      password: "",
      email: "",
    });

    setCheckboxChecked(false);
  };

  return (
    <div className="loginSignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Signup" && (
            <>
              <input
                type="text"
                placeholder="Your Name"
                name="username"
                value={formData.username}
                onChange={changeHandler}
                autoComplete="off"
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </>
          )}
          <input
            type="email"
            placeholder="Your Email Address"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            autoComplete="off"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
          <input
            type="password"
            placeholder="Your Password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            className="password-input"
          />
          {state === "Login" && (
            <span
              className="forgot-password"
              onClick={() => Navigate("/verificationcode")}
            >
              Forgot Password?
            </span>
          )}
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>
        <button onClick={state === "Login" ? loginFunction : signupFunction}>
          Continue
        </button>
        <p className="loginsignup-login">
          {state === "Signup" ? (
            <>
              Already have an account?{" "}
              <span onClick={() => handleStateChange("Login")}>Login here</span>
              <br />
            </>
          ) : (
            <>
              Create an account?{" "}
              <span onClick={() => handleStateChange("Signup")}>
                Click here
              </span>
            </>
          )}
        </p>
        {state === "Signup" && (
          <div className="loginsignup-agree">
            <input
              type="checkbox"
              checked={checkboxChecked}
              onChange={handleCheckboxChange}
            />
            <span>
              By continuing, I agree to the terms of use and privacy policies.
            </span>
            {errors.checkbox && (
              <span className="error-message">{errors.checkbox}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
