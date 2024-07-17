
import { useState } from "react";

import headerImg from "../assets/SupportMaast/header.png";
import shopcard from "../assets/Shop/shopcard.png";
import { useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
const OnlineShop = () => {
  const [stores, setStores] = useState(null);
  const [activeTab, setActiveTab] = useState("store");
  const [offers, setOffers] = useState(null);
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          "https://proxy-server-4er9.onrender.com/"
        );
        console.log(response.data);
        setStores(response.data.stores);
      } catch (error) {
        console.log(error);
      }

      // setStores(data);
    };
    fetchStores();
  }, []);
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          "https://proxy-server-4er9.onrender.com/offers"
        );
        setOffers(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }

      // setStores(data);
    };
    fetchStores();
  }, []);

  return (
    <div className=" overflow-hidden px-10">
      {/* { 1st page } */}
      <div>
        <img src={headerImg} alt="Loading..." className=" w-full h-full" />
      </div>
      {/* { 2nd page } */}
      <div className="flex items-center justify-start py-4 px-6 bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="bg-black text-white py-2 px-4 rounded cursor-pointer">
            SAVINGS MODE &rarr;
          </div>
          <div
            className={`py-2 px-4 rounded cursor-pointer ${
              activeTab === "store" ? "bg-teal-500 text-white" : ""
            }`}
            onClick={() => setActiveTab("store")}
          >
            Savings by Store
          </div>
          <div
            className={`py-2 px-4 rounded cursor-pointer ${
              activeTab === "services" ? "bg-teal-500 text-white" : ""
            }`}
            onClick={() => setActiveTab("services")}
          >
            Savings by Services
          </div>
        </div>
        <div className="flex items-center ml-auto">
          <div className="relative">
            <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search name of Shop, Store, brand, Product"
              className="pl-10 pr-4 py-2 rounded bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
      {/* { 3rd page } */}
      {activeTab === "store" ? (
        <div>
          {stores === null ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="flex items-center justify-center flex-wrap gap-12 p-10">
              {stores?.map((item) => {
                return (
                  <div
                    className="p-5 w-[200px]"
                    style={{
                      boxShadow:
                        "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
                    }}
                    key={item.id}
                  >
                    <Link to={item?.url}>
                      <div>
                        <img src={item.logo} alt="" className="w-40 h-20" />
                      </div>

                      <p className="text-center font-bold text-base m-2">
                        {item?.merchant}
                      </p>
                      <button className="bg-[#0F9B03] text-white rounded-md px-2 m-auto flex">
                        {item?.payout} cashback
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div>
          {offers == null ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="flex justify-center flex-wrap items-center gap-10 mt-10">
              {offers?.map((item) => {
                return (
                  <div key={item.id}>
                    <div>
                      <img src={shopcard} alt="" className="w-22" />
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold text-xl">Food Station</p>
                      <p className="my-2 text-lg ">Kolkata, Bow Bazar</p>
                      <button className="bg-[#0059DE] text-white rounded-lg p-1 text-sm ">
                        10% Cahsback
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineShop;
