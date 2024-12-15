import HeroSection from "./hero-section";
import ProductGrid from "./product-grid";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

export default function Page() {
  const { shopId } = useParams();
  const [shopDetail, setShopDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    async function getShopInfo() {
      if (!shopId) return;
      try {
        const shopDocRef = doc(db, "businessDetails", shopId);
        const shopDocSnap = await getDoc(shopDocRef);
        if (shopDocSnap.exists()) {
          setShopDetail(shopDocSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getShopInfo();
  }, [shopId]);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen bg-background p-20">
      <HeroSection shopDetail={shopDetail} categoryList={categoryList} />
      <div className="my-10"></div>
      <ProductGrid productList={productList} />
    </main>
  );
}
