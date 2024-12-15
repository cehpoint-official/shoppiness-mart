import { Button } from "../../Components/ui/button";
import { Card, CardContent } from "../../Components/ui/card";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import Loader from "../Loader/Loader";
import CouponModal from "./CouponFormModal";
import { useParams } from "react-router-dom";

export default function ProductInfoHeader({ shopId, productId }) {
  const [productDetail, setProductDetail] = useState({});
  const [shopDetail, setShopDetail] = useState({});
  const [loader1, setLoader1] = useState(true);
  const [loader2, setLoader2] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    async function getProductDetail(productId) {
      if (!productId) return;
      try {
        const productDocRef = doc(db, "productDetails", productId);
        const productDocSnap = await getDoc(productDocRef);
        if (productDocSnap.exists()) {
          setProductDetail(productDocSnap.data());
        } else {
          console.log("No such document");
        }
      } catch (error) {
        console.log("Error fetching product data:", error);
      } finally {
        setLoader1(false);
      }
    }
    getProductDetail(productId);
  }, [productId]);

  useEffect(() => {
    async function getProductDetail(shopId) {
      if (!shopId) return;
      try {
        const shopDocRef = doc(db, "businessDetails", shopId);
        const shopDocSnap = await getDoc(shopDocRef);
        if (shopDocSnap.exists()) {
          setShopDetail(shopDocSnap.data());
        } else {
          console.log("No such document");
        }
      } catch (error) {
        console.log("Error fetching product data:", error);
      } finally {
        setLoader2(false);
      }
    }
    getProductDetail(shopId);
  }, [shopId]);

  if (loader1 || loader2) return <Loader />;

  return (
    <div className="min-h-screen">
      <Card className="mx-auto ">
        <CardContent className="px-16 py-4">
          {/* Header */}
          <div className="mb-8 flex justify-end">
            <div className="rounded-lg bg-gray-50 px-4 py-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {shopDetail.businessName}
              </h2>
              <p className="text-sm text-gray-600">{shopDetail.location}</p>
            </div>
          </div>

          {/* Product Content */}
          <div className="grid gap-8 md:grid-cols-2 pb-8">
            {/* Product Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg ">
              <div className="absolute inset-0 flex items-start justify-center">
                <img
                  src={productDetail.imageUrl}
                  alt=""
                  className="h-[300px] w-[80%] object-cover rounded-md"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                  {productDetail.name}
                </h1>

                <p className="text-sm leading-relaxed text-gray-600">
                  {productDetail.description}
                </p>

                <div className="flex items-baseline space-x-3 pt-4">
                  <span className="text-lg text-gray-500 line-through">
                    ₹
                    {Number(productDetail.price) +
                      Number(
                        (productDetail.price * productDetail.discount) / 100
                      )}
                  </span>
                  <span className="text-3xl font-bold">
                    ₹{productDetail.price}
                  </span>
                  <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
                    {productDetail.discount}%OFF
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  Get cashback by generating Coupon
                </p>
                <div
                  className=""
                  style={{
                    opacity: userId ? 1 : 0.7,
                    pointerEvents: userId ? "auto" : "none"
                  }}
                >
                  <CouponModal
                    productDetail={productDetail}
                    shopDetail={shopDetail}
                    productId={productId}
                  />
                </div>

                {!userId && (
                  <p className="text-sm font-medium">Login to Generate</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
