// import React, { createContext, useEffect, useState } from "react";
// import { load } from "@cashfreepayments/cashfree-js";
// import toast from "react-hot-toast";

// const defaultCart = () => {
//   let cart = {};
//   for (let i = 0; i < 100 + 1; i++) {
//     cart[i] = 0;
//   }
//   return cart;
// };

// export const ShopContext = createContext(null);

// export const ShopContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState(defaultCart());
//   const [all_product, setAllProducts] = useState([]);

//   const fetchAllProducts = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:4000/api/products/allproducts",
//         {
//           method: "GET",
//         }
//       );
//       const data = await response.json();
//       if (data.success) {
//         setAllProducts(data.allProduct);
//       }
//     } catch (error) {
//       console.log("Error in fetching all products from server ", error.message);
//     }
//   };

//   const fetchcartData = async () => {
//     const token = localStorage.getItem("auth-token");
//     if (token) {
//       try {
//         const resposnse = await fetch(
//           "http://localhost:4000/api/users/fetchcart",
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!resposnse.ok) {
//           throw new Error("Response error!");
//         }
//         const data = await resposnse.json();
//         if (data.cartData) {
//           setCartItems(data.cartData);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchAllProducts();
//     fetchcartData();
//   }, []);

//   const addtoCart = (itemID) => {
//     setCartItems((prev) => ({
//       ...prev,
//       [itemID]: (prev[itemID]||0) + 1,
//     }));
//     if (localStorage.getItem("auth-token")) {
//       fetch("http://localhost:4000/api/products/addtocart", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ itemID: itemID }),
//       })
//         .then((resposnse) => resposnse.json())
//         .then((data) => console.log(data));
//     }
//   };

//   // Remove item from the cart
//   const removetoCart = (itemID) => {
//     setCartItems((prev) => ({
//       ...prev,
//       [itemID]: 0,
//     }));
//     if (localStorage.getItem("auth-token")) {
//       fetch("http://localhost:4000/api/products/removetocart", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ itemID: itemID }),
//       })
//         .then((resposnse) => resposnse.json())
//         .then((data) => console.log(data));
//     }
//   };

//   // Get total number of items in the cart
//   const getTotalCartItems = () => {
//     return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
//   };

//   // Get total amount for the items in the cart
//   const getTotalCartAmount = () => {
//     return Object.keys(cartItems).reduce((totalAmt, itemID) => {
//       const qty = cartItems[itemID];
//       if (qty > 0) {
//         const product = all_product.find(
//           (product) => product.id === Number(itemID)
//         );
//         totalAmt += product?.new_price * qty;
//       }
//       return totalAmt;
//     }, 0);
//   };

//   const initiateShopperPayment = async (products, totalAmount) => {
//     try {
//       const token = localStorage.getItem("auth-token");

//       const response = await fetch(
//         "http://localhost:4000/api/payments/initiate/payment",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ products, totalAmount }),
//         }
//       );

//       const data = await response.json();

//       if (!data.success) {
//         toast.error("Failed to initiate payment.");
//         return;
//       }

//       localStorage.setItem(
//         "shopper_payment_data",
//         JSON.stringify({ orderId: data.orderId, products, totalAmount })
//       );

//       const cashfree = await load({ mode: "sandbox" });

//       cashfree.checkout({
//         paymentSessionId: data.paymentSessionId,
//         redirectTarget: "_self",
//       });
//     } catch (err) {
//       console.error("Initiate Payment Error:", err.message);
//       toast.error("Could not initiate payment.");
//     }
//   };

//   const finalizeShopperPayment = async () => {
//     try {
//       const token = localStorage.getItem("auth-token");
//       const storedData = localStorage.getItem("shopper_payment_data");

//       if (!storedData) return { success: false };

//       const payload = JSON.parse(storedData);

//       // prevent repeated calls
//       const alreadyVerified = localStorage.getItem("already_verified");
//       if (alreadyVerified === payload.orderId) {
//         return { success: true };
//       }

//       const response = await fetch(
//         "http://localhost:4000/api/payments/order/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         localStorage.removeItem("shopper_payment_data");
//         localStorage.setItem("already_verified", payload.orderId);
//         setCartItems(defaultCart());
//         return { success: true };
//       } else {
//         return { success: false };
//       }
//     } catch (err) {
//       console.error("Finalize Payment Error:", err.message);
//       toast.error("Something went wrong while verifying payment.");
//       return { success: false };
//     }
//   };

//   const ContextValue = {
//     all_product,
//     cartItems,
//     addtoCart,
//     removetoCart,
//     getTotalCartItems,
//     getTotalCartAmount,
//     initiateShopperPayment,
//     finalizeShopperPayment,
//   };

//   return (
//     <ShopContext.Provider value={ContextValue}>
//       {props.children}
//     </ShopContext.Provider>
//   );
// };






import React, { createContext, useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import toast from "react-hot-toast";

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

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/allproducts`, {
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
        const resposnse = await fetch(`${BASE_URL}/api/users/fetchcart`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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
      [itemID]: (prev[itemID] || 0) + 1,
    }));

    if (localStorage.getItem("auth-token")) {
      fetch(`${BASE_URL}/api/products/addtocart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemID }),
      })
        .then((resposnse) => resposnse.json())
        .then((data) => console.log(data));
    }
  };

  const removetoCart = (itemID) => {
    setCartItems((prev) => ({
      ...prev,
      [itemID]: 0,
    }));

    if (localStorage.getItem("auth-token")) {
      fetch(`${BASE_URL}/api/products/removetocart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemID }),
      })
        .then((resposnse) => resposnse.json())
        .then((data) => console.log(data));
    }
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
  };

  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((totalAmt, itemID) => {
      const qty = cartItems[itemID];
      if (qty > 0) {
        const product = all_product.find(
          (product) => product.id === Number(itemID)
        );
        totalAmt += product?.new_price * qty;
      }
      return totalAmt;
    }, 0);
  };

  const initiateShopperPayment = async (products, totalAmount) => {
    try {
      const token = localStorage.getItem("auth-token");

      const response = await fetch(
        `${BASE_URL}/api/payments/initiate/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ products, totalAmount }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error("Failed to initiate payment.");
        return;
      }

      localStorage.setItem(
        "shopper_payment_data",
        JSON.stringify({ orderId: data.orderId, products, totalAmount })
      );

      const cashfree = await load({ mode: "sandbox" });

      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error("Initiate Payment Error:", err.message);
      toast.error("Could not initiate payment.");
    }
  };

  const finalizeShopperPayment = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const storedData = localStorage.getItem("shopper_payment_data");

      if (!storedData) return { success: false };

      const payload = JSON.parse(storedData);

      const alreadyVerified = localStorage.getItem("already_verified");
      if (alreadyVerified === payload.orderId) {
        return { success: true };
      }

      const response = await fetch(`${BASE_URL}/api/payments/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("shopper_payment_data");
        localStorage.setItem("already_verified", payload.orderId);
        setCartItems(defaultCart());
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (err) {
      console.error("Finalize Payment Error:", err.message);
      toast.error("Something went wrong while verifying payment.");
      return { success: false };
    }
  };

  const ContextValue = {
    all_product,
    cartItems,
    addtoCart,
    removetoCart,
    getTotalCartItems,
    getTotalCartAmount,
    initiateShopperPayment,
    finalizeShopperPayment,
  };

  return (
    <ShopContext.Provider value={ContextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
