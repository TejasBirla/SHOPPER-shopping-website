// import React, { useState } from "react";
// import "./NewsLetter.css";

// export default function NewsLetter() {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleEmailInput = (event) => {
//     setEmail(event.target.value);
//     setError("");
//   };

//   const handleSubscription = async () => {
//     const token = localStorage.getItem("auth-token");
//     if (!token) {
//       setError("Please login to subscribe.");
//       setMessage("");
//       return;
//     }
//     if (!email) {
//       setError("Please enter an email address.");
//       setMessage("");
//       return;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError("Please enter a valid email address.");
//       setMessage("");
//       return;
//     }
//     try {
//       const resposne = await fetch(
//         "http://localhost:4000/api/products/newsletter",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ email }),
//         }
//       );
//       const data = await resposne.json();
//       if (data.success) {
//         setMessage(data.message);
//         setError("");
//         setEmail("");
//       } else {
//         setError(data.message);
//         setMessage("");
//         setEmail("");
//       }
//     } catch {
//       setError("Subscription failed,please try again later.");
//       return;
//     }
//   };

//   return (
//     <div className="news-letter">
//       <h1>Get exclusive deals on your Email</h1>
//       <p>Subscribe to our newsletter</p>
//       {!email && (
//         <span className="newsletter-info-message">
//           To ensure a smooth subscription process, please enter the same email
//           address used for login or signup.
//         </span>
//       )}

//       <div>
//         <input
//           type="email"
//           placeholder="Your email ID"
//           value={email}
//           onChange={handleEmailInput}
//         />
//         <button onClick={handleSubscription}>Subscribe</button>
//       </div>
//       {error && <span className="newsletter-error-message">{error}</span>}
//       {message && <span className="newsletter-success-message">{message}</span>}
//     </div>
//   );
// }

import React, { useState } from "react";
import "./NewsLetter.css";

export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const handleEmailInput = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleSubscription = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      setError("Please login to subscribe.");
      setMessage("");
      return;
    }
    if (!email) {
      setError("Please enter an email address.");
      setMessage("");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setMessage("");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/products/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setError("");
        setEmail("");
      } else {
        setError(data.message);
        setMessage("");
        setEmail("");
      }
    } catch {
      setError("Subscription failed, please try again later.");
    }
  };

  return (
    <div className="news-letter">
      <h1>Get exclusive deals on your Email</h1>
      <p>Subscribe to our newsletter</p>
      {!email && (
        <span className="newsletter-info-message">
          To ensure a smooth subscription process, please enter the same email
          address used for login or signup.
        </span>
      )}

      <div>
        <input
          type="email"
          placeholder="Your email ID"
          value={email}
          onChange={handleEmailInput}
        />
        <button onClick={handleSubscription}>Subscribe</button>
      </div>
      {error && <span className="newsletter-error-message">{error}</span>}
      {message && <span className="newsletter-success-message">{message}</span>}
    </div>
  );
}
