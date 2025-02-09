import React from "react";
import "./NewsLetter.css";

export default function NewsLetter() {
  return (
    <div className="news-letter">
      <h1>Get exclusive deals on your Email</h1>
      <p>Subscribe to our newsletter</p>
      <div>
        <input type="email" placeholder="Your email ID" />
        <button>Subscribe</button>
      </div>
    </div>
  );
}
