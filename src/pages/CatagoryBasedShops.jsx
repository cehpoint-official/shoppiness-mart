import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import LocationSelector from "../Components/LocationSelector";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useLocation, useParams } from "react-router-dom";

const CatagoryBasedShops = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const { category,userId } = useParams();
  const location = useLocation();
  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "businessDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData.mode === "Offline" && shopData.cat === category) {
          data.push({ id: doc.id, ...shopData });
        }
      });
      console.log(data);

      setShops(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
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

      return locationMatch && searchMatch;
    });
  }, [shops, selectedLocation, searchTerm]);

  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center p-2 bg-white rounded-md shadow-md max-w-full">
          <LocationSelector onLocationSelect={handleLocationSelect} />
          <input
            type="text"
            className="flex-grow p-2 w-full sm:w-auto focus:outline-none"
            placeholder="Search name of Shop, Store, brand, Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-2 mt-2 sm:mt-0">
            <FaSearch className="text-gray-500" />
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12">
        <h1 className="text-2xl font-semibold mb-16">
          Popular <span className="text-orange-500">{category}</span> Shops
          close to you
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredShops.length > 0 ? (
            filteredShops.map((item) => (
              <Link
                to={
                  location.pathname.includes("/user-dashboard")
                    ? `/user-dashboard/${userId}/offline-shop/${category}/${item.id}`
                    : `/offline-shop/${category}/${item.id}`
                }
                key={item.id}
              >
                <div>
                  <img
                    src={item.bannerUrl}
                    alt={item.businessName}
                    className="w-full md:w-22 object-cover rounded-3xl"
                  />
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-xl">{item.businessName}</p>
                  <p className="my-2 text-lg text-gray-500">{item.location}</p>
                  <button className="bg-[#0059DE] text-white rounded-full px-2 py-1 text-sm">
                    10% Cashback
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">
              No shops found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatagoryBasedShops;
