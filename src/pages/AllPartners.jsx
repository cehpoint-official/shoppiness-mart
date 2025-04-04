import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {  FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const AllPartners = () => {
  const [shopsData, setShopsData] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModeFilter, setShowModeFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const location = useLocation();
  const userId = location.pathname.split("/")[2] || "";

  // Mock data fetching from Firebase (this would be replaced with actual Firebase implementation)
  useEffect(() => {
    // Simulating data fetching delay
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "businessDetails"));
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        // Filter shops with rate between 20-50
        const eligibleShops = data.filter(
          (shop) =>
            parseInt(shop.rate) >= 20 &&
            parseInt(shop.rate) <= 50 &&
            (shop.mode === "Online" || shop.mode === "Offline")
        );

        setShopsData(eligibleShops);
        setFilteredShops(eligibleShops);
        setIsLoading(false);
      } catch (error) {
        console.log("Error getting documents: ", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract unique categories
  const categories = ["All", ...new Set(shopsData.map((shop) => shop.cat))];



  // Handle filters
  useEffect(() => {
    let filtered = [...shopsData];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (shop) =>
          shop.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.cat.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply mode filter
    if (selectedMode !== "All") {
      filtered = filtered.filter((shop) => shop.mode === selectedMode);
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((shop) => shop.cat === selectedCategory);
    }


    setFilteredShops(filtered);
  }, [searchTerm, selectedMode, selectedCategory, shopsData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-[#047E72] text-white py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Most Preferred Partners
          </h1>
          <p className="text-lg md:text-xl max-w-3xl opacity-90">
            Explore our curated list of partners offering exclusive cashback
            rates between 10% and 25%. Shop smart and maximize your savings with
            Shoppinessmart.
          </p>
        </div>
      </div>

      {/* Info section */}
      <div className="bg-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Why Shop with Our Partners?
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="w-4 h-4 text-[#047E72]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span>
                    Earn up to{" "}
                    <span className="font-semibold">25% cashback</span> on your
                    purchases
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="w-4 h-4 text-[#047E72]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span>
                    Support businesses that give back to the community
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="w-4 h-4 text-[#047E72]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span>
                    Choose from both online and offline shopping experiences
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="w-4 h-4 text-[#047E72]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span>Donate a portion of your cashback to charity</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Partnership Values
              </h2>
              <p className="text-gray-700 mb-4">
                Shoppinessmart partners with businesses that align with our
                mission of giving back to the community. We carefully select
                partners who share our values of:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="w-4 h-4 text-[#047E72]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span>
                    <span className="font-semibold">Sustainability</span> -
                    Environmentally conscious business practices
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="w-4 h-4 text-[#047E72]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span>
                    <span className="font-semibold">Ethical practices</span> -
                    Fair trade and responsible sourcing
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="w-4 h-4 text-[#047E72]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span>
                    <span className="font-semibold">Customer satisfaction</span>{" "}
                    - High quality products and excellent service
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Partners section */}
      <div className="container mx-auto max-w-7xl py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Explore Our Partners
        </h2>

        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow md:max-w-md">
              <input
                type="text"
                placeholder="Search partners by name, location, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047E72] focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Mode filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowModeFilter(!showModeFilter);
                    setShowCategoryFilter(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <FiFilter className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Mode: {selectedMode}
                    </span>
                  </span>
                  <FiChevronDown className="h-4 w-4" />
                </button>
                {showModeFilter && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {["All", "Online", "Offline"].map((mode) => (
                      <div
                        key={mode}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedMode(mode);
                          setShowModeFilter(false);
                        }}
                      >
                        {mode}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCategoryFilter(!showCategoryFilter);
                    setShowModeFilter(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <FiFilter className="h-4 w-4" />
                    <span className="text-sm font-medium truncate">
                      Category: {selectedCategory}
                    </span>
                  </span>
                  <FiChevronDown className="h-4 w-4" />
                </button>
                {showCategoryFilter && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategoryFilter(false);
                        }}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredShops.length} partners
            {selectedMode !== "All" && ` in ${selectedMode} mode`}
            {selectedCategory !== "All" && ` from ${selectedCategory} category`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#047E72]"></div>
          </div>
        ) : filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredShops.map((shop) => (
              <PartnerCard
                key={shop.id}
                shop={shop}
                userId={userId}
                location={location}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No partners found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedMode("All");
                setSelectedCategory("All");
              }}
              className="mt-4 px-6 py-2 bg-[#047E72] text-white rounded-lg hover:bg-[#036459] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* CTA section */}
      <div className="bg-[#EEFAF9] py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Start Shopping and Make a Difference
            </h2>
            <p className="text-gray-700 mb-8">
              When you shop with our partners, you not only get great cashback
              rates but also contribute to making the world a better place. A
              portion of every purchase can be donated to charitable causes.
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-[#047E72] text-white rounded-lg font-medium hover:bg-[#036459] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AllPartners;

// Partner card component
const PartnerCard = ({ shop, userId, location }) => {
  const isUserDashboard = location.pathname.includes("/user-dashboard");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="relative h-40 bg-gray-100 flex items-center justify-center p-4">
        <img
          src={shop.logoUrl}
          alt={shop.businessName}
          className="max-h-full max-w-full object-contain"
        />
        <div className="absolute top-2 right-2 bg-[#047E72] text-white text-xs px-2 py-1 rounded-full">
          {shop.mode}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{shop.businessName}</h3>
        <p className="text-gray-600 text-sm mb-2 truncate">{shop.location}</p>
        <p className="text-sm text-gray-700 h-12 overflow-hidden">
          {shop.shortDesc}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="bg-green-100 text-[#047E72] px-3 py-1 rounded-full text-sm font-medium">
            {shop.rate / 2}% Cashback
          </span>
          <Link
            to={
              shop.mode === "Online"
                ? isUserDashboard
                  ? `/user-dashboard/${userId}/online-shop/${shop.id}`
                  : `/online-shop/${shop.id}`
                : isUserDashboard
                ? `/user-dashboard/${userId}/offline-shop/${shop.cat}/${shop.id}`
                : `/offline-shop/${shop.cat}/${shop.id}`
            }
            className="text-[#047E72] font-medium text-sm hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
