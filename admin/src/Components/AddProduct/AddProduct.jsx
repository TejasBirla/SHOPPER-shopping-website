import { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

export default function AddProduct () {
  const initialProductState = {
    name: "",
    image: "",
    category: "Women",
    old_price: "",
    new_price: "",
  };
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "Women",
    old_price: "",
    new_price: "",
  });

  const clearDetails = () => {
    setProductDetails(initialProductState);
    setImage(null);
  };

  const changeHandler = (event) => {
    setProductDetails({
      ...productDetails,
      [event.target.name]: event.target.value,
    });
  };

  const imageHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const add_product = async () => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;
    let formData = new FormData();
    formData.append("product", image);

    await fetch("http://localhost:4000/api/upload", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      await fetch("http://localhost:4000/api/products/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) =>
          data.success ? alert("Product Added") : alert("Failed")
        );
    }
  };

  return (
    <div className="add-product">
      <div className="add-product-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="type here"
        />
      </div>
      <div className="add-product-price">
        <div className="add-product-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="type here"
          />
        </div>
        <div className="add-product-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="type here"
          />
        </div>
      </div>
      <div className="add-product-itemfield">
        <p>Select Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="product-selector"
        >
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
      </div>
      <div className="add-product-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
            className="uploadImg"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button
        onClick={() => {
          add_product();
        }}
        className="add-product-btn"
      >
        ADD
      </button>
      <button
        onClick={() => {
          clearDetails();
        }}
        className="add-product-btn"
      >
        CLEAR
      </button>
    </div>
  );
}
