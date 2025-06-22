import React, { createContext, useEffect, useState } from "react";

const defaultCart = () => {
  let cart = {};
  for (let i = 0; i < 100 + 1; i++) {
    cart[i] = 0;
  }
  return cart;
};

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(defaultCart());
  const [all_product, setAllProducts] = useState([]);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch("http://localhost:4000/allproducts", {
        method: "GET",
      });
      const data = await response.json();
      if (data.success) {
        setAllProducts(data.allProduct);
      }
    } catch (error) {
      console.log("Error in fetching all products from server ", error.message);
    }
  };

  const fetchcartData = async () => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      try {
        const resposnse = await fetch("http://localhost:4000/fetchcart", {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });
        if (!resposnse.ok) {
          throw new Error("Response error!");
        }
        const data = await resposnse.json();
        if (data.cartData) {
          setCartItems(data.cartData);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchcartData();
  }, []);

  const addtoCart = (itemID) => {
    setCartItems((prev) => ({
      ...prev,
      [itemID]: prev[itemID] + 1,
    }));
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemID: itemID }),
      })
        .then((resposnse) => resposnse.json())
        .then((data) => console.log(data));
    }
  };

  // Remove item from the cart
  const removetoCart = (itemID) => {
    setCartItems((prev) => ({
      ...prev,
      [itemID]: 0,
    }));
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/removetocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemID: itemID }),
      })
        .then((resposnse) => resposnse.json())
        .then((data) => console.log(data));
    }
  };

  // Get total number of items in the cart
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
  };

  // Get total amount for the items in the cart
  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((totalAmt, itemID) => {
      const qty = cartItems[itemID];
      if (qty > 0) {
        const product = all_product.find(
          (product) => product.id === Number(itemID)
        );
        totalAmt += product.new_price * qty;
      }
      return totalAmt;
    }, 0);
  };

  const ContextValue = {
    all_product,
    cartItems,
    addtoCart,
    removetoCart,
    getTotalCartItems,
    getTotalCartAmount,
  };

  return (
    <ShopContext.Provider value={ContextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
