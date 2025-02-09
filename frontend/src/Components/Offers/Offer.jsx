import React from "react";
import "./Offer.css";
import ExclusiveImg from "../assets/Frontend_Assets/exclusive_image.png";

export default function Offer() {
  return (
    <div className="offer">
      <div className="offer-left">
        <h1>
          Exclusive <br />
          Offers For You
        </h1>
        <p>ONLY ON BEST SELLER PRODUCTS</p>
        <button>Check now</button>
      </div>
      <div className="offer-right">
        <img src={ExclusiveImg} alt="" />
      </div>
    </div>
  );
}
