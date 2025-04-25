import {FaSearch, FaArrowRight } from "react-icons/fa";
import { useEffect, useState, useMemo, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../Components/Loader/Loader";
import LocationSelector from "../Components/LocationSelector";

// Import your icons and images here
import foodIcon from "../assets/Shop/food.png";
import groceryIcon from "../assets/Shop/grocery.png";
import pharmacyIcon from "../assets/Shop/pharmacy.png";
import fashionIcon from "../assets/Shop/fashion.png";
import electronicsIcon from "../assets/Shop/electronics.png";
import beautyIcon from "../assets/Shop/beauty.png";
import sportIcon from "../assets/Shop/sport.png";
import corporateIcon from "../assets/Shop/corporate.png";
import shop from "../assets/Shop/shops.png";
import giftImage from "../assets/Shop/gift.png";
import website from "../assets/Shop/website..png";
import giftCard from "../assets/Shop/gift-card.png";
import cashBack from "../assets/Shop/cash-back.png";

import imaoffshop from "../assets/Shop/imaoffshop.png";
import imaoffshop1 from "../assets/Shop/image 72.png";
import imaoffshop2 from "../assets/Shop/image 73.png";
import imaoffshop3 from "../assets/Shop/image 74.png";
import imaoffshop4 from "../assets/Shop/image 75.png";
import imaoffshop8 from "../assets/Shop/image 76.png";
import imaoffshop11 from "../assets/Shop/image 77.png";
import imaoffshop10 from "../assets/Shop/image 78.png";
import imaoffshop6 from "../assets/Shop/image 79.png";
import imaoffshop9 from "../assets/Shop/image 80.png";
import imaoffshop5 from "../assets/Shop/image 80.png";
import imaoffshop7 from "../assets/Shop/image 82.png";
import { Link, useLocation, useParams } from "react-router-dom";

const OfflineShop = () => {
  const [shops, setShops] = useState([]);
  const [groupedShops, setGroupedShops] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const location = useLocation();
  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "businessDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData.mode === "Offline" && shopData.status === "Active") {
          data.push({ id: doc.id, ...shopData });
        }
      });
      setShops(data);

      const grouped = data.reduce((acc, shop) => {
        if (shop.cat && shop.cat.trim() !== "") {
          if (!acc[shop.cat]) {
            acc[shop.cat] = [];
          }
          acc[shop.cat].push(shop);
        }
        return acc;
      }, {});
      setGroupedShops(grouped);
    } catch (error) {
      console.log("Error getting documents: ", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredShops = useMemo(() => {
    if (!shops.length) return [];

    return shops.filter((shop) => {
      const locationMatch =
        !selectedLocation ||
        shop.location
          ?.toLowerCase()
          .includes(selectedLocation.name.toLowerCase());

      const searchMatch =
        !searchTerm ||
        shop.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.cat.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(shop.cat);

      return locationMatch && searchMatch && categoryMatch;
    });
  }, [shops, selectedLocation, searchTerm, selectedCategories]);

  useEffect(() => {
    const grouped = filteredShops.reduce((acc, shop) => {
      if (shop.cat && shop.cat.trim() !== "") {
        if (!acc[shop.cat]) {
          acc[shop.cat] = [];
        }
        acc[shop.cat].push(shop);
      }
      return acc;
    }, {});

    setGroupedShops(grouped);
  }, [filteredShops]);

  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  const categories = useMemo(
    () => [
      { name: "Food", icon: foodIcon },
      { name: "Grocery", icon: groceryIcon },
      { name: "Pharmacy", icon: pharmacyIcon },
      { name: "Fashion", icon: fashionIcon },
      { name: "Electronics", icon: electronicsIcon },
      { name: "Beauty", icon: beautyIcon },
      { name: "Sport", icon: sportIcon },
      { name: "Corporate", icon: corporateIcon },
    ],
    []
  );

  const toggleCategory = useCallback((categoryName) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((cat) => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  }, []);

  const features = useMemo(
    () => [
      {
        image: website,
        text: "Visit favorite stores listed in Shopping Mart",
      },
      {
        image: giftCard,
        text: "Generate a coupon",
      },
      {
        image: shop,
        text: "Visit offline shop",
      },
      {
        image: giftImage,
        text: "Reedem your coupon",
      },
      {
        image: cashBack,
        text: "Get cashback; you can also give back to support an NGO or cause",
      },
    ],
    []
  );

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      {/* Search Section */}
      <div className="container mx-auto py-4 px-3 md:px-6 lg:px-8">
        <div className="flex flex-col p-2 bg-white rounded-md shadow-md w-full">
          <LocationSelector onLocationSelect={handleLocationSelect} />
          <div className="flex w-full mt-2">
            <input
              type="text"
              className="flex-grow p-2 focus:outline-none w-full"
              placeholder="Search shop, brand, product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="p-2">
              <FaSearch className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section with Selection */}
      <div className="flex justify-center py-4 px-2 md:p-8 w-full flex-wrap gap-2 md:gap-3">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => toggleCategory(category.name)}
            className={`flex flex-col items-center w-[22%] sm:w-[22%] md:w-1/5 lg:w-1/6 p-2 cursor-pointer transition-colors duration-200 
              ${
                selectedCategories.includes(category.name)
                  ? "bg-orange-100 rounded-lg"
                  : ""
              }`}
          >
            <img
              src={category.icon}
              alt={category.name}
              className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mb-1 bg-[#F7F7F7] rounded-full p-2"
            />
            <span className="text-gray-700 text-center text-xs md:text-sm">{category.name}</span>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="px-3 py-6 md:p-8">
        <h2 className="text-center text-lg md:text-xl lg:text-2xl font-bold mb-6 md:mb-12 px-2">
          How do you get happiness with{" "}
          <span className="text-orange-500">Shoppiness Mart</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center px-1">
              <img
                src={feature.image}
                alt="Feature"
                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mb-2 md:mb-4"
              />
              <p className="text-xs md:text-sm">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shop Images Section */}
      <div className="bg-[#FFE0CF] px-3 py-4 my-6 md:my-12 flex justify-around items-center flex-wrap gap-2 md:px-10 md:gap-4">
        {[
          imaoffshop,
          imaoffshop1,
          imaoffshop2,
          imaoffshop3,
          imaoffshop4,
          imaoffshop5,
          imaoffshop6,
          imaoffshop7,
          imaoffshop8,
          imaoffshop9,
          imaoffshop10,
          imaoffshop11,
        ].map((img, index) => (
          <div key={index}>
            <img src={img} alt="" className="w-8 md:w-12 lg:w-16" />
          </div>
        ))}
      </div>

      {/* Filtered Shops by Category Section */}
      {loading ? (
        <Loader />
      ) : (
        <div className="p-3 md:p-8">
          {Object.entries(groupedShops).map(([category, categoryShops]) => (
            <div key={category} className="my-6 md:my-10">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold my-4 md:my-8 text-center px-2">
                Popular <span className="text-orange-500">{category}</span>{" "}
                Shops close to you
              </h2>
              <div className="flex overflow-x-auto pb-4 space-x-3 md:space-x-4 w-full px-2 md:px-10">
                {categoryShops.map((shop) => (
                  <Link
                    to={
                      location.pathname.includes("/user-dashboard")
                        ? `/user-dashboard/${userId}/offline-shop/${category}/${shop.id}`
                        : `/offline-shop/${category}/${shop.id}`
                    }
                    key={shop.id}
                    className="flex-none bg-white shadow-md rounded-2xl overflow-hidden w-48 sm:w-56 md:w-64 lg:w-72"
                  >
                    <img
                      src={shop.bannerUrl}
                      alt={shop.businessName}
                      className="w-full h-24 md:h-32 object-cover"
                    />
                    <div className="p-3 md:p-4">
                      <h3 className="text-base md:text-lg font-bold">{shop.businessName}</h3>
                      <p className="text-gray-600 text-sm md:text-base">{shop.location}</p>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 mt-2 rounded">
                        {shop.rate}% Cashback
                      </span>
                    </div>
                  </Link>
                ))}
                <Link
                  to={
                    location.pathname.includes("/user-dashboard")
                      ? `/user-dashboard/${userId}/offline-shop/${category}`
                      : `/offline-shop/${category}`
                  }
                  className="flex-none flex flex-col justify-center items-center bg-gray-100 shadow-md rounded-2xl w-24 md:w-28 cursor-pointer min-h-[100px]"
                >
                  <p className="text-orange-500 font-bold text-sm md:text-base">View More</p>
                  <FaArrowRight className="text-orange-500 mt-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfflineShop;