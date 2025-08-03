// import React, { useEffect, useState } from "react";
// import "./CSS/MyOrders.css";

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem("auth-token");
//       if (!token) {
//         setError("You need to log in to view your orders.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch("http://localhost:4000/api/users/myorders", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setOrders(data.orders);
//           console.log(data.orders);
//         } else {
//           const errData = await response.json();
//           setError(errData.message || "Failed to fetch orders.");
//         }
//       } catch (err) {
//         setError("Something went wrong. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) {
//     return <div className="myorder-loading">Loading your orders...</div>;
//   }

//   if (error) {
//     return <div className="myorder-error">{error}</div>;
//   }

//   return (
//     <div className="myorder-container">
//       <h1>My Orders</h1>
//       {orders.length === 0 ? (
//         <p>You have no orders yet.</p>
//       ) : (
//         <div className="myorder-list">
//           {orders.map((order) => (
//             <div key={order._id} className="myorder-item">
//               <h2>Order ID: {order._id}</h2>
//               <p>
//                 Order Date: {new Date(order.orderDate).toLocaleDateString()}
//               </p>
//               <p>Status: {order.status}</p>
//               <div className="myorder-products">
//                 <h3>Products:</h3>
//                 {order.products.map((product) => (
//                   <div key={product.productID._id} className="myorder-product">
//                     <img
//                       src={product.productID.image}
//                       alt={product.productID.name}
//                       className="myorder-product-image"
//                     />
//                     <div>
//                       <p>
//                         <strong>Name:</strong> {product.productID.name}
//                       </p>
//                       <p>
//                         <strong>Category:</strong> {product.productID.category}
//                       </p>
//                       <p>
//                         <strong>Price:</strong> ₹{product.price}
//                       </p>
//                       <p>
//                         <strong>Quantity:</strong> {product.quantity}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrder;





import React, { useEffect, useState } from "react";
import "./CSS/MyOrders.css";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        setError("You need to log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:4000/api/users/myorders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders);
        } else {
          setError(data.message || "Failed to fetch orders.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="myorder-loading">⏳ Loading your orders...</div>;
  }

  if (error) {
    return <div className="myorder-error">❌ {error}</div>;
  }

  return (
    <div className="myorder-container">
      <h1 className="myorder-title">🛍️ My Orders</h1>
      {orders.length === 0 ? (
        <p className="myorder-empty">You have no orders yet.</p>
      ) : (
        <div className="myorder-list">
          {orders.map((order) => (
            <div key={order._id} className="myorder-item">
              <div className="myorder-header">
                <h2 className="order-id">Order ID: {order._id}</h2>
                <p
                  className={`myorder-status ${order.paymentStatus.toLowerCase()}`}
                >
                  {order.paymentStatus}
                </p>
              </div>
              <p className="myorder-date">
                Ordered on: {new Date(order.orderDate).toLocaleString()}
              </p>
              <div className="myorder-products">
                {order.products.map((product) => (
                  <div key={product.productID._id} className="myorder-product">
                    <img
                      src={product.productID.image}
                      alt="product-img"
                      className="myorder-product-image"
                    />
                    <div className="myorder-product-details">
                      <h5>{product.productID.name}</h5>
                      <p>Category: {product.productID.category}</p>
                      <p>Price: ₹{product.price}</p>
                      <p>Quantity: {product.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="myorder-total">Total: ₹{order.totalAmount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
