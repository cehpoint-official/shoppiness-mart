import { useState, useEffect, useCallback } from "react";
import shopcard from "../assets/Shop/shopcard.png";
import onlineShopHeader from "../assets/onlineShopHeader.png";
import Loader from "../Components/Loader/Loader";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const OnlineShop = () => {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState(null);
  const [activeTab, setActiveTab] = useState("store");
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          "https://proxy-server-4er9.onrender.com"
        );
        setStores(response.data.stores);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "businessDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData.mode === "Online") {
          data.push({ id: doc.id, ...shopData });
        }
      });
      setShops(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredShops = shops.filter((shop) =>
    shop.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return loading ? (
    <Loader />
  ) : (
    <div className="overflow-hidde px-4">
      <div>
        <img
          src={onlineShopHeader}
          alt="Loading..."
          className="w-full h-auto px-0"
        />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between py-4 bg-white shadow-sm">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
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
          {loading ? (
            <Loader />
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-10 mt-10">
              {filteredShops.length === 0 ? (
                <div className="text-center">No shops found</div>
              ) : (
                filteredShops.map((item) => (
                  <div key={item.id}>
                    <div>
                      <img
                        src={item.bannerUrl}
                        alt={item.businessName}
                        className="w-full md:w-22 rounded-2xl"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold text-xl">
                        {item.businessName}
                      </p>
                      <p className="my-2 text-lg">{item.location}</p>
                      <button className="bg-[#0059DE] text-white rounded-lg px-2 py-1 text-sm">
                        {item.rate}% Cashback
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineShop;
