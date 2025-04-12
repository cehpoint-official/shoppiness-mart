import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../Components/Loader/Loader";
import { useSelector } from "react-redux";

// Google Maps API Key - Replace with your actual API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MAX_DISTANCE_KM = 20; // Maximum distance in kilometers to be considered "nearby"
const SHOPS_PER_PAGE = 6; // Number of shops to display per page

const CauseDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.userReducer);
  const [cause, setCause] = useState(null);
  const [allShops, setAllShops] = useState([]);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're in the user dashboard
  const isUserDashboard = location.pathname.includes("/user-dashboard");

  // Get userId either from Redux state or URL pathname
  const userId =
    user?.id || (isUserDashboard ? location.pathname.split("/")[2] : null);

  // console.log("User ID:", userId);

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Function to get geocode from address
  const getGeocode = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
      return null;
    } catch (error) {
      console.error("Error getting geocode:", error);
      return null;
    }
  };

  // Function to filter shops by distance
  const filterShopsByDistance = async (causeLocation, shops) => {
    try {
      // Get coordinates for the cause location
      const causeCoords = await getGeocode(causeLocation);

      if (!causeCoords) return [];

      // Process shops in batches to avoid rate limiting
      const processedShops = [];
      for (const shop of shops) {
        // Get coordinates for the shop location
        const shopCoords = await getGeocode(shop.location);
        if (shopCoords) {
          // Calculate distance between cause and shop
          const distance = calculateDistance(
            causeCoords.lat,
            causeCoords.lng,
            shopCoords.lat,
            shopCoords.lng
          );

          // Add distance property to shop object
          const shopWithDistance = {
            ...shop,
            distance,
            distanceText: `${distance.toFixed(1)} km away`,
          };

          // Consider it nearby if within MAX_DISTANCE_KM
          if (distance <= MAX_DISTANCE_KM) {
            processedShops.push(shopWithDistance);
          }
        }
      }

      // Sort by distance (closest first)
      return processedShops.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error("Error filtering shops by distance:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cause details
        const causeRef = doc(db, "causeDetails", id);
        const causeDoc = await getDoc(causeRef);

        if (!causeDoc.exists()) {
          console.error("Cause not found");
          setLoading(false);
          return; // Exit early if cause doesn't exist
        }

        const causeData = { id: causeDoc.id, ...causeDoc.data() };
        setCause(causeData);

        // Fetch only active businesses
        const businessQuery = query(
          collection(db, "businessDetails"),
          where("status", "==", "Active")
        );

        const querySnapshot = await getDocs(businessQuery);
        const shops = [];
        querySnapshot.forEach((doc) => {
          shops.push({ id: doc.id, ...doc.data() });
        });

        setAllShops(shops);

        // Filter shops by distance using Google Maps API
        if (causeData.location) {
          const nearby = await filterShopsByDistance(causeData.location, shops);
          setNearbyShops(nearby);
          setTotalPages(Math.ceil(nearby.length / SHOPS_PER_PAGE));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Get current page of shops
  const getCurrentPageShops = () => {
    const startIndex = (currentPage - 1) * SHOPS_PER_PAGE;
    const endIndex = startIndex + SHOPS_PER_PAGE;
    return nearbyShops.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setPageLoading(true);
    setCurrentPage(pageNumber);

    // Simulate page loading for better UX
    setTimeout(() => {
      setPageLoading(false);
    }, 300);

    // Scroll to shops section
    document
      .getElementById("shops-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Handle case where cause doesn't exist
  if (!cause) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Cause Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The cause you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to={
              isUserDashboard ? `/user-dashboard/${userId}/support` : "/support"
            }
            className="text-teal-500 hover:underline"
          >
            Return to Support Causes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="relative h-80 md:h-96">
        <img
          src={cause.bannerUrl}
          alt={cause.causeName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-4">
              <img
                src={cause.logoUrl}
                alt={cause.causeName}
                className="w-16 h-16 md:w-24 md:h-24 rounded-lg object-cover border-4 border-white mr-4"
              />
              <div>
                <h1 className="text-white text-3xl md:text-4xl font-bold">
                  {cause.causeName}
                </h1>
                <div className="flex items-center text-white mt-2">
                  <MdLocationOn className="text-xl mr-1" />
                  <span>{cause.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              About This Cause
            </h2>
            <p className="text-gray-600 mb-6">{cause.aboutCause}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Location</h3>
                <p className="text-gray-600">{cause.location}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Email</h3>
                <p className="text-gray-600">{cause.email}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                How to Support
              </h2>
              <p className="text-gray-600 mb-6">
                You can support {cause.causeName} by shopping at any business —
                whether online or offline. When you make a purchase using a
                generated coupon, you'll receive cashback, and {cause.causeName}{" "}
                will receive a donation — all at no extra cost to you!
              </p>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-teal-700 text-lg mb-2">
                  How It Works
                </h3>
                <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                  <li>
                    <span className="font-medium">Shop at any store</span> —
                    Whether online or offline, choose any shop you prefer.
                  </li>
                  <li>
                    <span className="font-medium">Generate a coupon</span> —
                    Create a special coupon before making your purchase from the
                    selected shops page.
                  </li>
                  <li>
                    <span className="font-medium">
                      Shop and apply your coupon
                    </span>{" "}
                    — Complete your purchase and use the generated coupon at
                    checkout.
                  </li>
                  <li>
                    <span className="font-medium">
                      Receive cashback and support the cause
                    </span>{" "}
                    — For example, on a ₹100 purchase with a 10% cashback offer,
                    ₹5 will be donated to {cause.causeName} (after platform
                    fees) and ₹5 will be credited to you as cashback. You can
                    either keep your cashback or choose to donate it to any NGO
                    or cause you care about.
                  </li>
                </ol>
              </div>

              {/* Shop Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Link
                  to={"/online-shop"}
                  state={{
                    causeName: cause.causeName,
                    causeId: id,
                    paymentDetails: cause.paymentDetails || {},
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors duration-200 shadow-md"
                >
                  Online Shops
                </Link>
                <Link
                  to="/offline-shop"
                  state={{
                    causeName: cause.causeName,
                    causeId: id,
                    paymentDetails: cause.paymentDetails || {},
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors duration-200 shadow-md"
                >
                  Offline Shops
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby shops section */}
        <div id="shops-section" className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Nearby Partner Shops ({nearbyShops.length})
            </h2>
            <div className="text-gray-600">
              Showing partners within {MAX_DISTANCE_KM} km
            </div>
          </div>

          {pageLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : nearbyShops.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentPageShops().map((shop) => (
                  <div
                    key={shop.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={shop.bannerUrl}
                        alt={shop.businessName}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <img
                          src={shop.logoUrl}
                          alt={shop.businessName}
                          className="w-12 h-12 rounded-full object-cover mr-3 border border-gray-200"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {shop.businessName}
                          </h3>
                          <p className="text-sm text-teal-500">
                            {shop.mode} • {shop.cat}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-2">{shop.shortDesc}</p>

                      <div className="flex items-center justify-between">
                        <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                          {shop.rate / 2}% Cashback Rate
                        </div>
                        <Link
                          to={
                            shop.mode === "Online"
                              ? userId
                                ? `/user-dashboard/${userId}/online-shop/${shop.id}`
                                : `/online-shop/${shop.id}`
                              : userId
                              ? `/user-dashboard/${userId}/offline-shop/${shop.cat}/${shop.id}`
                              : `/offline-shop/${shop.cat}/${shop.id}`
                          }
                          state={{
                            causeName: cause.causeName,
                            causeId: id,
                            paymentDetails: cause.paymentDetails || {},
                          }}
                          className="text-teal-500 font-medium hover:text-teal-700 flex items-center"
                        >
                          View Details
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded ${
                          currentPage === index + 1
                            ? "bg-teal-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600">
                No partner shops found near {cause.causeName}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CauseDetails;
