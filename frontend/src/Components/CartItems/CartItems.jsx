import React, { useContext, useEffect, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Contexts/ShopContext";
import removeIcon from "../assets/Frontend_Assets/cart_cross_icon.png";
import dropDownIcon from "../assets/Frontend_Assets/dropdown_icon.png";
import { useNavigate } from "react-router-dom";

export default function CartItems() {
  const navigate = useNavigate();
  const { all_product, removetoCart, cartItems, getTotalCartAmount } =
    useContext(ShopContext);

  const [isDropDownClicked, setDropDownClicked] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountVal, setDiscount] = useState(0);
  const [errors, setError] = useState("");

  const promoCodes = [
    {
      code: "SHOPPER-SPECIAL",
      description: "25% off on your first purchase",
      discount: 25,
    },
    {
      code: "DISCOUNT10",
      description: "10% off on your next purchase",
      discount: 10,
    },
    {
      code: "SUMMER20",
      description: "20% off on summer collection",
      discount: 20,
    },
  ];

  const handlePromoCode = (selectedCode) => {
    const promo = promoCodes.find((item) => item.code === selectedCode);
    if (promo) {
      const totalAmt = getTotalCartAmount();
      const discountAmt = (totalAmt * promo.discount) / 100;
      setDiscount(discountAmt);
      setError("");
    } else {
      setError("Invalid Promo-Code");
      setDiscount(0);
    }
  };

  useEffect(() => {
    if (promoCode) {
      handlePromoCode(promoCode);
    }
  });

  const newTotalAmt = getTotalCartAmount() - discountVal;

  return (
    <div className="cart-items">
      <div className="cart-item-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((product) => {
        if (cartItems[product.id] > 0) {
          return (
            <div key={product.id}>
              <div className="cart-item-format cart-item-format-main">
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-item-img"
                  onClick={() => navigate(`/product/${product.id}`)}
                />
                <p onClick={() => navigate(`/product/${product.id}`)} style={{cursor:"pointer"}}>
                  {product.name}
                </p>
                <p>₹{product.new_price.toFixed(2)}</p>
                <button className="cart-quantity">
                  {cartItems[product.id]}
                </button>
                <p>₹{(product.new_price * cartItems[product.id]).toFixed(2)}</p>
                <img
                  className="remove-icon"
                  src={removeIcon}
                  alt="Remove"
                  onClick={() => removetoCart(product.id)}
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cart-item-down">
        <div className="cart-item-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cart-item-total-item">
              <p>Sub Total</p>
              <p>₹{getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-item-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            {promoCode && (
              <>
                <div className="cart-item-total-item">
                  <p>Promo Code Applied</p>
                  <p>{promoCode}</p>
                </div>
                <hr />
                <div className="cart-item-total-item">
                  <p>Discount</p>
                  <p>₹{discountVal.toFixed(2)}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-item-total-item">
              <h3>Total</h3>
              <p>₹{newTotalAmt.toFixed(2)}</p>
            </div>
            <hr />
          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-item-promocode">
          <p>If you have a promo code, enter it here:</p>
          <div className="promobox">
            <img
              src={dropDownIcon}
              alt="drop-down"
              className="input-icon"
              onClick={() => {
                setDropDownClicked((prev) => !prev);
              }}
            />

            <input
              type="text"
              placeholder="Enter your promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />

            {isDropDownClicked && (
              <ul className="dropdown-menu">
                {promoCodes.map((code, index) => (
                  <li
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      setPromoCode(code.code);
                      handlePromoCode(code.code);
                      setDropDownClicked((prev) => !prev);
                    }}
                  >
                    {code.code} - {code.description}
                  </li>
                ))}
              </ul>
            )}
            {promoCode ? (
              <button
                onClick={() => {
                  setDiscount(0);
                  setPromoCode("");
                  setError("");
                }}
              >
                Clear
              </button>
            ) : (
              <button onClick={() => handlePromoCode(promoCode)}>Submit</button>
            )}
            {errors && <p style={{ color: "red" }}>{errors}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
