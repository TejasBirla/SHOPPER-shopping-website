import React, { useContext } from "react";
import { ShopContext } from "../Contexts/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import RelatedProduct from "../Components/RelatedProducts/RelatedProduct";

export default function Product() {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_product.find((event) => event.id === Number(productId));
  return (
    <div className="products">
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <RelatedProduct />
    </div>
  );
}
