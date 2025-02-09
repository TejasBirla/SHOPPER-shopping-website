import { useEffect, useState } from "react";
import "./ListProduct.css";
import removeIcon from "../../assets/cross_icon.png";

export default function ListProduct() {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch("http://localhost:4000/allproducts")
      .then((resp) => resp.json())
      .then((data) => setAllProducts(data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    await fetch("http://localhost:4000/removeproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listitems">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <>
              <div className="main format" key={index}>
                <img src={product.image} alt="" className="icon" />
                <p>{product.name}</p>
                <p>{product.old_price}</p>
                <p>{product.new_price}</p>
                <p>{product.category}</p>
                <img
                  src={removeIcon}
                  alt=""
                  className="remove-icon"
                  onClick={() => {
                    removeProduct(product.id);
                  }}
                />
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
}
