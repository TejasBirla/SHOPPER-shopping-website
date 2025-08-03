import React from "react";
import "./Breadcrum.css";
import arrowIcon from "../assets/Frontend_Assets/breadcrum_arrow.png";

export default function Breadcrum(props) {
  const { product } = props;
  return (
    <div className="breadcrum">
      SHOP <img src={arrowIcon} alt="arrow-icon" />
      {product?.category} <img src={arrowIcon} alt="" />
      {product?.name}
    </div>
  );
}
