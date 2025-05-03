import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { MdLocationOn, MdEmail, MdInfo, MdEvent, MdPhoto } from "react-icons/md";
import { FaHandHoldingHeart, FaStore, FaGlobe, FaCalendarAlt } from "react-icons/fa";
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
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
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [pastEvents, setPastEvents] = useState([]);
  const [pastEventsLoading, setPastEventsLoading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const galleryRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're in the user dashboard
  const isUserDashboard = location.pathname.includes("/user-dashboard");

  // Get userId either from Redux state or URL pathname
  const userId =
    user?.id || (isUserDashboard ? location.pathname.split("/")[2] : null);

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

  // Fetch past events for this cause
  const fetchPastEvents = async (causeId) => {
    try {
      setPastEventsLoading(true);
      const eventsQuery = query(
        collection(db, "ngoPastEvents"),
        where("causeId", "==", causeId),
        orderBy("date", "desc")
      );

      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData = [];

      eventsSnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });

      setPastEvents(eventsData);
    } catch (error) {
      console.error("Error fetching past events:", error);
    } finally {
      setPastEventsLoading(false);
    }
  };

  // Fetch gallery images for this cause
  const fetchGallery = async (causeId) => {
    try {
      setGalleryLoading(true);
      const galleryQuery = query(
        collection(db, "ngoGallery"),
        where("ngoId", "==", causeId)
      );

      const gallerySnapshot = await getDocs(galleryQuery);
      let galleryData = [];

      // Check if we found a document
      if (!gallerySnapshot.empty) {
        // Get the first (and should be only) document
        const galleryDoc = gallerySnapshot.docs[0];
        const data = galleryDoc.data();

        // If the document has an items array, use it as our gallery data
        if (data.items && Array.isArray(data.items)) {
          galleryData = data.items.map(item => ({
            id: item.imageId,
            imageUrl: item.imageUrl,
            caption: item.caption || '',
            uploadDate: item.uploadDate || data.lastUpdated || data.createdAt
          }));
        }
      }

      setGallery(galleryData);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setGalleryLoading(false);
    }
  };

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  // Fetch tab-specific data when tab changes
  useEffect(() => {
    if (id && activeTab === "pastEvents") {
      fetchPastEvents(id);
    } else if (id && activeTab === "gallery") {
      fetchGallery(id);
    }
  }, [id, activeTab]);

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

  // Open image lightbox
  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  // Close image lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  // Handle case where cause doesn't exist
  if (!cause) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Cause Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The cause you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to={
              isUserDashboard ? `/user-dashboard/${userId}/support` : "/support"
            }
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Return to Support Causes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with improved responsive banner handling */}
      <div className="relative">
        {/* Using aspect-ratio to maintain proportions without cropping */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
          <img
            src={cause.bannerUrl}
            alt={cause.causeName}
            className="w-full h-full object-cover"
            onLoad={() => setBannerLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        {/* Content overlay with improved responsive styling */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 sm:py-8 z-10">
          <div className="container mx-auto">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-3">
              <div className="relative">
                <img
                  src={cause.logoUrl}
                  alt={cause.causeName}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-lg object-cover border-2 sm:border-4 border-white shadow-lg"
                />
                <div className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                  Verified
                </div>
              </div>
              <div>
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg mt-2">
                  {cause.causeName}
                </h1>
                <div className="flex items-center text-white mt-1 sm:mt-2 justify-center sm:justify-start">
                  <MdLocationOn className="text-lg sm:text-xl mr-1 text-teal-300" />
                  <span className="text-sm sm:text-base text-gray-100">{cause.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with improved styling */}
      <div className="container mx-auto px-4 py-10">
        {/* Back button */}
        <Link
          to={isUserDashboard ? `/user-dashboard/${userId}/support` : "/support"}
          className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Causes
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs navigation */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("about")}
                className={`px-6 py-4 font-medium transition-colors duration-200 ${activeTab === "about"
                  ? "text-teal-600 border-b-2 border-teal-500 bg-white"
                  : "text-gray-500 hover:text-teal-600"
                  }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("pastEvents")}
                className={`px-6 py-4 font-medium transition-colors duration-200 ${activeTab === "pastEvents"
                  ? "text-teal-600 border-b-2 border-teal-500 bg-white"
                  : "text-gray-500 hover:text-teal-600"
                  }`}
              >
                Past Events
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`px-6 py-4 font-medium transition-colors duration-200 ${activeTab === "gallery"
                  ? "text-teal-600 border-b-2 border-teal-500 bg-white"
                  : "text-gray-500 hover:text-teal-600"
                  }`}
              >
                Gallery
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* About Tab Content */}
            {activeTab === "about" && (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <MdInfo className="text-2xl text-teal-500" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    About This Cause
                  </h2>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  {cause.aboutCause}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <MdLocationOn className="text-teal-500 mr-2" />
                      Location
                    </h3>
                    <p className="text-gray-600">{cause.location}</p>
                  </div>
                  {/* <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <MdEmail className="text-teal-500 mr-2" />
                      Email
                    </h3>
                    <p className="text-gray-600">{cause.email}</p>
                  </div> */}
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <FaHandHoldingHeart className="text-2xl text-teal-500" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      How to Support
                    </h2>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    You can support <span className="font-medium text-teal-600">{cause.causeName}</span> by shopping at any business —
                    whether online or offline. When you make a purchase using a
                    generated coupon, you'll receive cashback, and {cause.causeName}{" "}
                    will receive a donation — all at no extra cost to you!
                  </p>

                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-8 mb-8">
                    <h3 className="font-bold text-teal-700 text-xl mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      How It Works
                    </h3>
                    <ol className="list-none space-y-5 text-gray-700">
                      <li className="flex items-start">
                        <div className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
                          1
                        </div>
                        <div>
                          <span className="font-medium text-teal-700">Shop at any store</span>
                          <p className="mt-1 text-gray-600">Whether online or offline, choose any shop you prefer.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
                          2
                        </div>
                        <div>
                          <span className="font-medium text-teal-700">Generate a coupon</span>
                          <p className="mt-1 text-gray-600">Create a special coupon before making your purchase from the selected shops page.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
                          3
                        </div>
                        <div>
                          <span className="font-medium text-teal-700">Shop and apply your coupon</span>
                          <p className="mt-1 text-gray-600">Complete your purchase and use the generated coupon at checkout.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
                          4
                        </div>
                        <div>
                          <span className="font-medium text-teal-700">Receive cashback and support the cause</span>
                          <p className="mt-1 text-gray-600">
                            For example, on a ₹100 purchase with a 10% cashback offer,
                            ₹5 will be donated to {cause.causeName} (after platform
                            fees) and ₹5 will be credited to you as cashback. You can
                            either keep your cashback or choose to donate it to any NGO
                            or cause you care about.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>

                  {/* Shop Buttons with improved design */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link
                      to={"/online-shop"}
                      state={{
                        causeName: cause.causeName,
                        causeId: id,
                        paymentDetails: cause.paymentDetails || {},
                      }}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-4 px-6 rounded-lg text-center transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <FaGlobe className="text-xl" />
                      <span>Online Shops</span>
                    </Link>
                    <Link
                      to="/offline-shop"
                      state={{
                        causeName: cause.causeName,
                        causeId: id,
                        paymentDetails: cause.paymentDetails || {},
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-4 px-6 rounded-lg text-center transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <FaStore className="text-xl" />
                      <span>Offline Shops</span>
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Past Events Tab Content */}
            {activeTab === "pastEvents" && (
              <>
                <div className="flex items-center gap-2 mb-8">
                  <MdEvent className="text-2xl text-teal-500" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Past Events
                  </h2>
                </div>

                {pastEventsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader />
                  </div>
                ) : pastEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-0 right-0 m-3">
                            <div className="bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                              <FaCalendarAlt className="h-3 w-3 mr-1 text-teal-500" />
                              {formatDate(event.date)}
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-gray-800 text-lg mb-3">{event.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500 flex items-center">
                              <MdLocationOn className="h-4 w-4 mr-1 text-teal-500" />
                              {event.location}
                            </div>
                            {event.impactFigure && (
                              <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium border border-teal-100">
                                {event.impactFigure}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-10 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Events Yet</h3>
                    <p className="text-gray-600">
                      {cause.causeName} hasn't uploaded any past events yet. Check back later for updates!
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Gallery Tab Content */}
            {activeTab === "gallery" && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <MdPhoto className="text-2xl text-teal-500" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Photo Gallery
                    </h2>
                  </div>
                  <div className="text-sm text-gray-500">
                    {gallery.length} {gallery.length === 1 ? 'photo' : 'photos'}
                  </div>
                </div>

                {galleryLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader />
                  </div>
                ) : gallery.length > 0 ? (
                  <div
                    ref={galleryRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  >
                    {gallery.map((image) => (
                      <div
                        key={image.id}
                        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 group"
                        onClick={() => openLightbox(image)}
                      >
                        <img
                          src={image.imageUrl}
                          alt={image.caption || "Gallery image"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {image.caption && (
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-end justify-center transition-all duration-300">
                            <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                              <p className="text-sm font-medium line-clamp-2">{image.caption}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-10 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Photos Yet</h3>
                    <p className="text-gray-600">
                      {cause.causeName} hasn't uploaded any photos yet. Check back later for updates!
                    </p>
                  </div>
                )}

                {/* Image Lightbox */}
                {selectedImage && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                  >
                    <div
                      className="relative max-w-6xl max-h-[90vh] w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-all duration-200"
                        onClick={closeLightbox}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                        <div className="relative">
                          <img
                            src={selectedImage.imageUrl}
                            alt={selectedImage.caption || "Gallery image"}
                            className="w-full max-h-[70vh] object-contain"
                          />
                        </div>
                        {selectedImage.caption && (
                          <div className="p-6 bg-white">
                            <p className="text-gray-800 font-medium">{selectedImage.caption}</p>
                            {selectedImage.uploadDate && (
                              <p className="text-sm text-gray-500 mt-2 flex items-center">
                                <FaCalendarAlt className="mr-2 h-3 w-3" />
                                {formatDate(selectedImage.uploadDate)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Nearby Shops section with improved UI */}
        <section id="shops-section" className="mt-12 mb-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-8">
                <FaStore className="text-2xl text-teal-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Shops Supporting This Cause
                </h2>
              </div>

              {nearbyShops.length > 0 ? (
                <>
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-blue-700 flex flex-wrap items-start sm:items-center text-sm sm:text-base">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>
                        Shop at any of these nearby businesses to support{' '}
                        <span className="font-semibold">{cause.causeName}</span>. Each purchase helps this cause!
                      </span>
                    </p>
                  </div>

                  {pageLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getCurrentPageShops().map((shop) => (
                          <div
                            key={shop.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300"
                          >
                            <div className="h-40 overflow-hidden relative">
                              <img
                                src={shop.bannerUrl || "/shop-placeholder.jpg"}
                                alt={shop.businessName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-0 right-0 m-3">
                                <div className="bg-white/80 backdrop-blur-sm text-teal-600 px-3 py-1 rounded-full text-sm font-medium">
                                  {shop.distanceText}
                                </div>
                              </div>
                            </div>
                            <div className="p-6">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                                    {shop.businessName}
                                  </h3>
                                  <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <MdLocationOn className="h-4 w-4 mr-1 text-teal-500" />
                                    {shop.location}
                                  </div>
                                </div>
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                  <img
                                    src={shop.logoUrl || "/logo-placeholder.jpg"}
                                    alt={`${shop.businessName} logo`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <div className="mt-2">
                                <Link
                                  to={isUserDashboard ? `/user-dashboard/${userId}/shop/${shop.id}` : `/shop/${shop.id}`}
                                  state={{
                                    causeName: cause.causeName,
                                    causeId: id,
                                    paymentDetails: cause.paymentDetails || {},
                                  }}
                                  className="block w-full bg-teal-500 hover:bg-teal-600 text-white text-center py-2 rounded-lg transition-colors duration-200"
                                >
                                  Shop Now
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-10 flex justify-center">
                          <div className="flex space-x-2">
                            {/* Previous page button */}
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>

                            {/* Page numbers */}
                            {[...Array(totalPages)].map((_, index) => (
                              <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`w-10 h-10 rounded-lg transition-colors duration-200 ${currentPage === index + 1
                                  ? "bg-teal-500 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                              >
                                {index + 1}
                              </button>
                            ))}

                            {/* Next page button */}
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="bg-gray-50 rounded-xl p-10 text-center border border-gray-100">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No Nearby Shops Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find shops near {cause.causeName}. You can still
                    support them by using online shops or exploring other options.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/online-shop"
                      state={{
                        causeName: cause.causeName,
                        causeId: id,
                        paymentDetails: cause.paymentDetails || {},
                      }}
                      className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors duration-200"
                    >
                      Browse Online Shops
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CauseDetails;