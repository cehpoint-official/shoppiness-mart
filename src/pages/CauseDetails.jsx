import React, { useState, useEffect } from "react";
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

const CauseDetails = () => {
  const { id } = useParams();
  const [cause, setCause] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading to true
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're in the user dashboard
  const isUserDashboard = location.pathname.includes("/user-dashboard");

  // Get userId from URL if we're in user dashboard
  const userId = isUserDashboard ? location.pathname.split("/")[2] : null;

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

        // Find nearby shops based on location (simplified example)
        // In a real app, you might use geolocation or more complex filtering
        const nearby = shops.filter(
          (shop) =>
            shop.location &&
            causeData.location &&
            shop.location.includes(causeData.location.split(",")[0])
        );

        setNearbyShops(nearby);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Generate the appropriate shop link based on shop mode and user login status
  const getShopLink = (shop) => {
    if (shop.mode === "Online") {
      return isUserDashboard
        ? `/user-dashboard/${userId}/online-shop/${shop.id}`
        : `/online-shop/${shop.id}`;
    } else {
      return isUserDashboard
        ? `/user-dashboard/${userId}/offline-shop/${shop.cat}/${shop.id}`
        : `/offline-shop/${shop.cat}/${shop.id}`;
    }
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
                You can support {cause.causeName} by shopping at partner
                businesses. When you make a purchase using a generated coupon,
                you'll receive cashback and {cause.causeName} will receive a
                donation - at no extra cost to you!
              </p>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-teal-700 text-lg mb-2">
                  How It Works
                </h3>
                <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                  <li>
                    <span className="font-medium">Select a partner shop</span> -
                    Choose from the businesses listed below that support this
                    cause
                  </li>
                  <li>
                    <span className="font-medium">Generate a coupon</span> -
                    Create a special coupon for your purchase
                  </li>
                  <li>
                    <span className="font-medium">
                      Shop and use your coupon
                    </span>{" "}
                    - Make a purchase and apply your coupon
                  </li>
                  <li>
                    <span className="font-medium">
                      Receive cashback and support the cause
                    </span>{" "}
                    - For example, on a ₹100 purchase with a 10% cashback rate,
                    you might receive ₹5 cashback while ₹5 goes to the cause
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby shops section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Partner Shops Supporting This Cause
          </h2>

          {nearbyShops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyShops.map((shop) => (
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

                    <p className="text-gray-600 mb-4">{shop.shortDesc}</p>

                    <div className="flex items-center justify-between">
                      <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                        {shop.rate}% Cashback Rate
                      </div>

                      <Link
                        to={getShopLink(shop)}
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
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600">
                No partner shops found supporting this cause yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CauseDetails;
