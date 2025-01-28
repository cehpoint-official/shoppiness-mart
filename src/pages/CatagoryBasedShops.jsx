import React, { useCallback, useMemo, useState } from "react";
import { FaMapMarkerAlt, FaTimes, FaSearch } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import LocationSelector from "../Components/LocationSelector";
import { Link } from "react-router-dom";

const CatagoryBasedShops = ({ category, shops, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

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
        <button
          onClick={onBack}
          className="hover:bg-gray-100 p-2 rounded-full flex items-center gap-2 text-lg"
        >
          <HiArrowLeft className="text-xl" /> <span>Back</span>
        </button>
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
              <Link to={`/shop/${item.id}`} key={item.id}>
                <div>
                  <img
                    src={item.bannerUrl}
                    alt={item.businessName}
                    className="w-full md:w-22 rounded-3xl"
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
