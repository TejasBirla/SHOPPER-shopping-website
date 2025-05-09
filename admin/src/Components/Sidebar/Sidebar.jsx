
import "./Sidebar.css";
import { Link } from "react-router-dom";
import add_product_item from "../../assets/Product_Cart.svg";
import list_product_item from "../../assets/Product_list_icon.svg";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_item} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={list_product_item} alt="" />
          <p>Product List</p>
        </div>
      </Link>
    </div>
  );
}
