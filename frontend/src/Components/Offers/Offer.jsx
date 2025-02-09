import React from "react";
import "./Offer.css";
import ExclusiveImg from "../assets/Frontend_Assets/exclusive_image.png";
import { useNavigate } from "react-router-dom";

export default function Offer() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/men");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="offer">
      <div className="offer-left">
        <h1>
          Exclusive <br />
          Offers For You
        </h1>
        <p>ONLY ON BEST SELLER PRODUCTS</p>
        <button onClick={handleNavigate}>Check now</button>
      </div>
      <div className="offer-right">
        <img src={ExclusiveImg} alt="" />
      </div>
    </div>
  );
}
