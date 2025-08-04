import React, { useContext } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Contexts/ShopContext";
import Item from "../Components/Item/item";

export default function ShopCategory(props) {
  const { all_product } = useContext(ShopContext);

  return (
    <>
      <div>
        <img className="shop-category-banner" src={props.banner} alt="" />
        <div className="shop-category-products">
          {all_product.map((value, index) => {
            if (props.category.toLowerCase() === value.category.toLowerCase()) {
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
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </>
  );
}