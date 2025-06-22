import React, { useContext, useEffect, useState } from "react";
import "./ProductDisplay.css";
import starIcon from "../assets/Frontend_Assets/star_icon.png";
import starDullIcon from "../assets/Frontend_Assets/star_dull_icon.png";
import { ShopContext } from "../../Contexts/ShopContext";

export default function ProductDisplay(props) {
  const { product } = props;
  const { addtoCart } = useContext(ShopContext);
  const [selectedSize, setSize] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setError("");
    setMessage("");
    setSize(null);
  }, [product]);

  const handleSize = (size) => {
    setSize(size);
    setError("");
  };

  const handleAddtoCart = () => {
    if (!selectedSize) {
      setError("Please select the size before adding to cart.");
      setMessage("");
    } else {
      addtoCart(product.id);
      setMessage("Item added to cart.");
      setSize(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className="product-display">
      <div className="product-display-left">
        <div className="img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
      </div>
      <div className="product-display-img">
        <img className="product-display-main-img" src={product.image} alt="" />
      </div>
      <div className="product-display-right">
        <h1>{product.name}</h1>
        <div className="product-display-star">
          <img src={starIcon} alt="" />
          <img src={starIcon} alt="" />
          <img src={starIcon} alt="" />
          <img src={starIcon} alt="" />
          <img src={starDullIcon} alt="" />
          <p>(122)</p>
        </div>
        <div className="product-right-prices">
          <div className="old-price">₹{product.old_price.toFixed(2)}</div>
          <div className="new-price">₹{product.new_price.toFixed(2)}</div>
        </div>
        <div className="product-desc">
          <p>
            This stylish and comfortable product is perfect for everyday wear.
            Featuring a modern design, it combines fashion with functionality,
            making it suitable for various occasions.
          </p>
        </div>
        <div className="prodcut-size">
          <h2>Select size</h2>
        </div>
        <div className="product-sizes">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() => handleSize(size)}
              className={`size ${selectedSize === size ? "selected" : ""}`}
            >
              {size}
            </div>
          ))}
        </div>
        <button className="addCartbtn" onClick={handleAddtoCart}>
          ADD TO CART
        </button>
        {error && <p style={{ color: "#ff4141", fontSize: "17px" }}>{error}</p>}
        {message && (
          <p style={{ color: "#22bb33", fontSize: "17px" }}>{message}</p>
        )}
      </div>
    </div>
  );
}
