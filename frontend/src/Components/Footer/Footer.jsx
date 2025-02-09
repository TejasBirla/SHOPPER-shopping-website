import React from "react";
import "./Footer.css";
import footerImg from "../assets/Frontend_Assets/logo_big.png";
import InstaIcon from "../assets/Frontend_Assets/instagram_icon.png";
import PintesterIcon from "../assets/Frontend_Assets/pintester_icon.png";
import WhatsappIcon from "../assets/Frontend_Assets/whatsapp_icon.png";

export default function Footer() {
  return (
    <>
      <div className="footer">
        <div className="footer-logo">
          <img src={footerImg} alt="" />
          <p>SHOPPER</p>
        </div>
        <ul className="footer-links">
          <li>Company</li>
          <li>Products</li>
          <li>Office</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
        <div className="footer-social-icon">
          <div className="footer-icon-container">
            <img src={InstaIcon} alt="" />
          </div>
          <div className="footer-icon-container">
            <img src={WhatsappIcon} alt="" />
          </div>
          <div className="footer-icon-container">
            <img src={PintesterIcon} alt="" />
          </div>
        </div>
        <div className="footer-copyright">
          <hr />
          <p>Copyright @ 2024 - All Right Reserved.</p>
        </div>
      </div>
    </>
  );
}
