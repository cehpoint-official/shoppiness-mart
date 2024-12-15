import React, { useEffect, useState } from "react";
import ProductInfoHeader from "./ProductInfoHeader";
import { useParams } from "react-router-dom";
import ProductGrid from "../ShopInfo/product-grid";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const ProductInfo = () => {
  const { shopId, productId } = useParams();
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const getProductsByShop = async (id) => {
      if (!id) return;
      try {
        const categoriesRef = collection(db, "productDetails");
        const q = query(categoriesRef, where("shop", "==", id));

        const querySnapshot = await getDocs(q);

        const services = [];
        querySnapshot.forEach((doc) => {
          services.push({ id: doc.id, ...doc.data() });
        });

        setProductList(services);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getProductsByShop(shopId);
  }, [shopId]);

  return (
    <div className="max-w-7xl m-auto py-10">
      <ProductInfoHeader shopId={shopId} productId={productId} />
      <h2 className="font-medium text-xl mb-4">Similer Items</h2>
      <ProductGrid productList={productList} />
    </div>
  );
};

export default ProductInfo;
