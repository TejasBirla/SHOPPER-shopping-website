import React from "react";
import "./item.css";
import { Link } from "react-router-dom";

export default function Item(props) {
  return (
    <div className="item">
      <Link
        to={`/product/${props.id}`}
        onClick={() => window.scrollTo(0, 0)}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img src={props.image} alt="" />
        <p>{props.name}</p>
      </Link>
      <div className="item-prices">
        <div className="item-new-price">₹{props.new_price}</div>
        <div className="item-old-price">₹{props.old_price}</div>
      </div>
    </div>
  );
}
