import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/item";

export default function NewCollections() {
  const [new_collection, set_new_collections] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/newcollections")
      .then((res) => res.json())
      .then((data) => set_new_collections(data));
  }, []);
  
  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((value, index) => {
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
