import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Coupons = () => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const couponsData = doc.data();
        if (couponsData.userId === userId && couponsData.status === "Pending") {
          data.push({ id: doc.id, ...couponsData });
        }
      });
      setCoupons(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied to clipboard!");
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getOfferText = (coupon) => {
    if (coupon.productDiscount) {
      return `Enjoy ${coupon.productDiscount}% Off In-Store ${coupon.productName} Purchase + ${coupon.userCashback}% Cashback at Shoppiness Mart!`;
    }
    return `For all purchase from ${coupon.businessName} you will get ${coupon.userCashback}% Cashback at Shoppiness Mart!`;
  };

  const formatDate = (dateString) => {
    return dateString.split("T")[0];
  };

  // Skeleton Loading Component
  const SkeletonCoupon = () => (
    <div className="border p-4 bg-[#e9f9f77a] shadow-sm relative animate-pulse">
      <div className="absolute top-4 right-4">
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-6 w-48 bg-gray-300 rounded"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 flex flex-col">
      <h1 className="text-2xl font-normal mb-6">Available Coupons</h1>

      <div className="space-y-4 overflow-y-auto flex-1">
        <div className="max-w-6xl mx-auto space-y-4">
          {loading ? (
            // Show skeleton while loading
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCoupon key={index} />
            ))
          ) : coupons.length > 0 ? (
            // Show actual coupons once data is loaded
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="border p-4 bg-[#e9f9f77a] shadow-sm relative"
              >
                <div className="absolute top-4 right-4">
                  <span className="text-gray-600 text-sm sm:text-base">
                    {formatDate(coupon.createdAt)}
                  </span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-blue-600 text-lg sm:text-xl font-normal pr-20 sm:pr-32">
                    {coupon.businessName}
                  </h2>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-gray-600 text-sm sm:text-base">
                      {getOfferText(coupon)}
                    </p>

                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-blue-600 text-base sm:text-lg">
                        Coupon code - {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy code"
                      >
                        <IoCopyOutline
                          className={
                            copiedCode === coupon.code
                              ? "text-green-500"
                              : "text-gray-400"
                          }
                          size={20}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-lg">
              You haven&apos;t generated any coupons yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupons;