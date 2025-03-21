import React, { useContext } from "react";
import "./navbar.css";
import logo from "../assets/Frontend_Assets/logo.png";
import cartIcon from "../assets/Frontend_Assets/cart_icon.png";
import { Link, useLocation } from "react-router-dom";
import { ShopContext } from "../../Contexts/ShopContext";

export default function Navbar() {
  let { getTotalCartItems } = useContext(ShopContext);
  const isLoggedIn = localStorage.getItem("auth-token");
  const location = useLocation(); // Get the current route

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="website-logo" />
        <p>SHOPPER</p>
      </div>
      <ul className="nav-menu">
        <li>
          <Link style={{ textDecoration: "none" }} to="/">
            Shop
          </Link>
          {location.pathname === "/" ? <hr /> : <></>}
        </li>
        <li>
          <Link style={{ textDecoration: "none" }} to="/men">
            Men
          </Link>
          {location.pathname === "/men" ? <hr /> : <></>}
        </li>
        <li>
          <Link style={{ textDecoration: "none" }} to="/women">
            Women
          </Link>
          {location.pathname === "/women" ? <hr /> : <></>}
        </li>
        <li>
          <Link style={{ textDecoration: "none" }} to="/kids">
            Kids
          </Link>
          {location.pathname === "/kids" ? <hr /> : <></>}
        </li>
        {isLoggedIn && (
          <li>
            <Link style={{ textDecoration: "none" }} to="/myorders">
              My Orders
            </Link>
            {location.pathname === "/myorders" ? <hr /> : <></>}
          </li>
        )}
      </ul>
      <div className="nav-login-cart">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => {
                localStorage.removeItem("auth-token");
                window.location.replace("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link style={{ textDecoration: "none" }} to="/login">
              <button>Login</button>
            </Link>
          </>
        )}
        <Link style={{ textDecoration: "none" }} to="/cart">
          <img src={cartIcon} alt="cart-icon" />
        </Link>
        <div className="nav-cart-counter">{getTotalCartItems()}</div>
      </div>
    </div>
  );
}
