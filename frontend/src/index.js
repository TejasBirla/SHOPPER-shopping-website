import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ShopContextProvider } from "./Contexts/ShopContext";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Toaster />
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </StrictMode>
);
