import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/navbar";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import LoginSignup from "./Pages/LoginSignup";
import Footer from "./Components/Footer/Footer";
import men_banner from "./Components/assets/Frontend_Assets/banner_mens.png";
import women_banner from "./Components/assets/Frontend_Assets/banner_women.png";
import kids_banner from "./Components/assets/Frontend_Assets/banner_kids.png";
import MyOrder from "./Pages/MyOrders";
import Verificationcode from "./Pages/Verificationcode";
import OTPverify from "./Pages/OTPverify";
import ResetPassword from "./Pages/ResetPassword";
import Payment from "./Components/payment/Payment";

function App() {
  const token = localStorage.getItem("auth-token");
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route
            path="/men"
            element={<ShopCategory banner={men_banner} category="men" />}
          />
          <Route
            path="/women"
            element={<ShopCategory banner={women_banner} category="women" />}
          />
          <Route
            path="/kids"
            element={<ShopCategory banner={kids_banner} category="kids" />}
          />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/myorders" element={<MyOrder />} />
          <Route
            path="/verificationcode"
            element={!token ? <Verificationcode /> : <Navigate to="/" />}
          />
          <Route
            path="/otpverify"
            element={!token ? <OTPverify /> : <Navigate to="/" />}
          />
          <Route
            path="/resetpassword"
            element={!token ? <ResetPassword /> : <Navigate to="/" />}
          />
          <Route path="/payment/success" element={<Payment />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
