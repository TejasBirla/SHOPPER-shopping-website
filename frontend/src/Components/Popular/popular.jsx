import React, { useEffect, useState } from "react";
import "./popular.css";
import Item from "../Item/item";

export default function Popular() {
  let [data_product, set_data_product] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/popularinwomen")
      .then((res) => res.json())
      .then((data) => set_data_product(data));
  }, []);

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
