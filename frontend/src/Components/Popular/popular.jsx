import React, { useEffect, useState } from "react";
import "./popular.css";
import Item from "../Item/item";

export default function Popular() {
  let [data_product, set_data_product] = useState([]);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/popularinwomen`)
      .then((res) => res.json())
      .then((data) => set_data_product(data));
  }, [BASE_URL]);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {data_product.map((value, index) => {
          return (
            <Item
              key={index}
              id={value.id}
              name={value.name}
              image={value.image}
              new_price={value.new_price.toFixed(2)}
              old_price={value.old_price.toFixed(2)}
            />
          );
        })}
      </div>
    </div>
  );
}
