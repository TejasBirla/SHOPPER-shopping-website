import React from "react";
import "./RelatedProduct.css";
import data_product from "../assets/Frontend_Assets/data";
import Item from "../Item/item";

export default function RelatedProduct() {
  return (
    <div className="related-products">
      <h1>Related Products</h1>
      <hr />
      <div className="related-product-items">
        {data_product.map((value, index) => {
          return (
            <Item
              key={index}
              id={value.id}
              name={value.name}
              image={value.image}
              new_price={(value.new_price).toFixed(2)}
              old_price={(value.old_price).toFixed(2)}
            />
          );
        })}
      </div>
    </div>
  );
}
