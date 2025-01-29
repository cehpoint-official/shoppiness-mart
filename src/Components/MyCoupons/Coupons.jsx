import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";

const Coupons = () => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const { userId } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const couponsData = doc.data();
        if (couponsData.userId === userId) {
          data.push({ id: doc.id, ...couponsData });
        }
      });
      setCoupons(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }, []);
  console.log(coupons);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-normal mb-6">Available Coupons</h1>

      <div className="space-y-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="border  p-4 bg-[#e9f9f77a] shadow-sm relative"
          >
            {/* Date in top right corner */}
            <div className="absolute top-4 right-4">
              <span className="text-gray-600">{coupon.createdAt}</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-blue-600 text-xl font-normal pr-32">
                {coupon.businessName}
              </h2>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* offer text */}
                <p className="text-gray-600">{coupon.productDiscount}</p>

                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-blue-600 text-lg">
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
        ))}
      </div>
    </div>
  );
};

export default Coupons;
