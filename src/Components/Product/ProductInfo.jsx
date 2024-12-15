import React from "react";
import ProductInfoHeader from "./ProductInfoHeader";
import { useParams } from "react-router-dom";

const ProductInfo = () => {
  const { userId, shopId, productId } = useParams();
  return (
    <div>
      <ProductInfoHeader shopId={shopId} productId={productId}/>
    </div>
  );
};

export default ProductInfo;
