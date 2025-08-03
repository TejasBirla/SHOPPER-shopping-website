import React from "react";
import "./hero.css";
import Handicon from "../assets/Frontend_Assets/hand_icon.png";
import Arrowicon from "../assets/Frontend_Assets/arrow.png";
import Heroimg from "../assets/Frontend_Assets/hero_image.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/women");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="hero">
      <div className="hero-left-sec">
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className="hero-hand-icon">
            <p>New</p>
            <img src={Handicon} alt="hand-icon" />
          </div>
          <p>Collections</p>
          <p>for everyone</p>
        </div>
        <div className="hero-new-btn" onClick={handleNavigate}>
          <div>Latest Collection</div>
          <img src={Arrowicon} alt="arrow" />
        </div>
      </div>
      <div className="hero-right-sec">
        <img src={Heroimg} alt="hero-img" />
      </div>
    </div>
  );
}
