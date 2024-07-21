import { useState, useEffect } from "react";
import shopcard from "../assets/Shop/shopcard.png";
import onlineShopHeader from "../assets/onlineShopHeader.png";
import Loader from "../Components/Loader/Loader";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const OnlineShop = () => {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState(null);
  const [activeTab, setActiveTab] = useState("store");
  const [offers, setOffers] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          "https://proxy-server-4er9.onrender.com/"
        );
        setLoading(false);
        setStores(response.data.stores);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          "https://proxy-server-4er9.onrender.com/offers"
        );
        setOffers(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOffers();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="overflow-hidden px-4 md:px-10">
      {/* 1st page */}
      <div>
        <img
          src={onlineShopHeader}
          alt="Loading..."
          className="w-full h-auto"
        />
      </div>

      {/* 2nd page */}
      <div className="flex flex-col md:flex-row items-center justify-between py-4 px-6 bg-white shadow-sm">
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
          {stores === null ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4 p-4 md:p-10">
              {stores?.map((item) => (
                <div
                  className="p-5 w-full md:w-[200px]"
                  style={{
                    boxShadow:
                      "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
                  }}
                  key={item.id}
                >
                  <Link to={item?.url}>
                    <div>
                      <img
                        src={item.logo}
                        alt=""
                        className="w-full h-20 md:w-40"
                      />
                    </div>
                    <p className="text-center font-bold text-base m-2">
                      {item?.merchant}
                    </p>
                    <button className="bg-[#0F9B03] text-white rounded-md px-2 m-auto flex">
                      {item?.payout} cashback
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {offers == null ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-10 mt-10">
              {offers?.map((item) => (
                <div key={item.id} className="text-center">
                  <div>
                    <img src={shopcard} alt="" className="w-full md:w-22" />
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold text-xl">Food Station</p>
                    <p className="my-2 text-lg ">Kolkata, Bow Bazar</p>
                    <button className="bg-[#0059DE] text-white rounded-lg p-1 text-sm">
                      10% Cashback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineShop;
