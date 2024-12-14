import HeroSection from "@/Components/ShopInfo/hero-section";
import ProductGrid from "@/components/ShopInfo/product-grid";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Page() {
  const { shopId } = useParams();
  const [shopDetail, setShopDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen bg-background p-20">
      <HeroSection shopDetail={shopDetail} />
      <ProductGrid />
    </main>
  );
}
