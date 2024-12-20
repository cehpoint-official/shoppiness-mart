import { useState, useEffect } from "react";
import shopcard from "../assets/Shop/shopcard.png";
import onlineShopHeader from "../assets/onlineShopHeader.png";
import Loader from "../Components/Loader/Loader";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const OnlineShop = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("store");
  const [stores, setStores] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [isStoreExpand, setIsStoreExpand] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          "http://13.201.98.0:443/inrdeals/stores"
        );
        setStores(response.data.data.stores);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStores();
  }, []);
  // useEffect(() => {
  //   const fetchStores = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://13.201.98.0:3000/inrdeals/coupons"
  //       );
  //       console.log(response.data.data.data);

  //       // setCoupons(response.data.data.stores);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchStores();
  // }, []);

  const displayedStores = isStoreExpand ? stores : stores.slice(0, 14);

  return loading ? (
    <Loader />
  ) : (
    <div className="overflow-hidde px-4">
      {/* 1st page */}
      <div>
        <img
          src={onlineShopHeader}
          alt="Loading..."
          className="w-full h-auto px-0"
        />
      </div>

      {/* 2nd page */}
      <div className="flex flex-col md:flex-row items-center justify-between py-4  bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-0">
          <div className="bg-black text-white text-sm py-2 px-4 rounded cursor-pointer">
            SAVINGS MODE &rarr;
          </div>
          <div
            className={`py-2 px-4 rounded cursor-pointer text-sm ${
              activeTab === "store" ? "bg-teal-500 text-white" : ""
            }`}
            onClick={() => setActiveTab("store")}
          >
            Savings by Store
          </div>
          <div
            className={`py-2 px-4 rounded cursor-pointer text-sm border-2 border-500-red ${
              activeTab === "services" ? "bg-teal-500 text-white" : ""
            }`}
            onClick={() => setActiveTab("services")}
          >
            Savings by Services
          </div>
        </div>
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full">
            <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search name of Shop, Store, brand, Product"
              className="pl-10 pr-4 py-2 w-full rounded bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* 3rd page */}
      {activeTab === "store" ? (
        <div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:px-24 py-10">
            {displayedStores.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    window.location.href = item.url;
                  }}
                  className="relative text-center shadow-md p-4 rounded-sm cursor-pointer w-40 h-44 flex flex-col gap-4"
                >
                  <div className="flex w-full justify-center">
                    <img
                      src={item.logo}
                      alt=""
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-sm">
                    {item.merchant.length > 16
                      ? item.merchant.slice(0, 16) + "..."
                      : item.merchant}
                  </h3>
                  <div className="bg-green-500 text-white rounded-md text-sm py-[1px]">
                    <p>
                      {item.payout.startsWith("₹")
                        ? `${item.payout} cashback`
                        : `${item.payout} discount`}
                    </p>
                  </div>
                </div>
              );
            })}
            {!isStoreExpand && (
              <button
                onClick={() => setIsStoreExpand(!isStoreExpand)}
                className="text-blue-600 border border-blue-600 px-20 py-1 font-normal mt-10"
              >
                View All Offers
              </button>
            )}
          </div>
          <div className="w-full">
            <p className="font-medium text-xl bg-[#EEFAF9] py-1 text-center my-8">
              Best Online Store Offers
            </p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default OnlineShop;
