import { useState, useEffect, useCallback, useMemo } from "react";
// import shopcard from "../assets/Shop/shopcard.png";
// import onlineShopHeader from "../assets/onlineShopHeader.png";
import Loader from "../Components/Loader/Loader";
import Carousel from "../Components/Carousel/Carousel";
import { FiSearch } from "react-icons/fi";
import { Link, useParams, useLocation } from "react-router-dom";
import { collection, getDocs, addDoc, query, where, onSnapshot, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";

import foodIcon from "../assets/Shop/food.png";
import groceryIcon from "../assets/Shop/grocery.png";
import pharmacyIcon from "../assets/Shop/pharmacy.png";
import fashionIcon from "../assets/Shop/fashion.png";
import electronicsIcon from "../assets/Shop/electronics.png";
import beautyIcon from "../assets/Shop/beauty.png";
import sportIcon from "../assets/Shop/sport.png";
import corporateIcon from "../assets/Shop/corporate.png";
// import Festive from "../assets/Shop/Festive.png";
// import Health from "../assets/Shop/Health.png";
import Jewellery from "../assets/Shop/Jewellery.png";
import Pets from "../assets/Shop/Pets.png";
import Stationary from "../assets/Shop/Stationary.png";
// import Toys from "../assets/Shop/Toys.png";

const OnlineShop = () => {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState(null);
  const [shops, setShops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAllStores, setShowAllStores] = useState(false);
  const [storeSearchTerm, setStoreSearchTerm] = useState("");
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const { userId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 50;

  const getInitialActiveTab = () => {
    // First check location.state
    if (location.state?.activeTab) {
      // Save to sessionStorage for persistence
      sessionStorage.setItem('shopActiveTab', location.state.activeTab);
      return location.state.activeTab;
    }

    // Then check sessionStorage
    const savedTab = sessionStorage.getItem('shopActiveTab');
    if (savedTab) {
      return savedTab;
    }

    // Default to "store"
    return "store";
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab);

  useEffect(() => {
    sessionStorage.setItem('shopActiveTab', activeTab);
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    sessionStorage.setItem('shopActiveTab', tab);
    setCurrentPage(1); // Reset page when switching tabs
  };

  useEffect(() => {
    const fetchBannerImage = async () => {
      try {
        // Fetch carousel images from db
        const contentDocRef = doc(db, "content", "onlineshopsBanners");
        const contentDocSnap = await getDoc(contentDocRef);

        if (contentDocSnap.exists()) {
          const contentDocData = contentDocSnap.data() || {};
          const sortedBanners = Object.values(contentDocData).sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });

          const topThreeBanners = sortedBanners[0].slice(0, 3).map(banner => banner.url);
          setCarouselImages(topThreeBanners);
        }
      } catch (error) {
        console.error("Error fetching banner image:", error);
      }
    };

    fetchBannerImage();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_AWS_SERVER}/inrdeals/stores`
        );

        const data = await response.json();
        if (data.success) {
          // Filter only active stores
          const activeStores = data.data.stores.filter(store => store.status === "active");

          //Remove the following line after successful onboarding of amazon and flipkart
          const filteredActiveStores = activeStores.filter(store => 
            store.merchant !== "Amazon India" && store.merchant !== "Flipkart"
          );

          setStores(filteredActiveStores);
        } else {
          console.error("Failed to fetch stores:", data.message);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const categories = useMemo(
    () => [
      { name: "Food", icon: foodIcon, matchTerms: ["Food", "Food & Grocery"] },
      { name: "Grocery", icon: groceryIcon, matchTerms: ["Grocery", "Food & Grocery"] },
      { name: "Fashion", icon: fashionIcon, matchTerms: ["Fashion"] },
      { name: "Electronics", icon: electronicsIcon, matchTerms: ["Electronics"] },
      { name: "Pharmacy", icon: pharmacyIcon, matchTerms: ["Pharmacy", "Health & Beauty"] },
      // { name: "Toys & Baby Care", icon: Toys, matchTerms: ["Toys", "Baby Care", "Kids"] },
      { name: "Books & Stationary", icon: Stationary, matchTerms: ["Books", "Stationary", "Education"] },
      { name: "Pets & Supplies", icon: Pets, matchTerms: ["Pets", "Pet Care", "Pet Supplies"] },
      // { name: "Health & Wellness", icon: Health, matchTerms: ["Health", "Wellness", "Healthcare"] },
      { name: "Jewellery & Accessories", icon: Jewellery, matchTerms: ["Jewellery", "Accessories", "Fashion Accessories"] },
      { name: "Beauty", icon: beautyIcon, matchTerms: ["Beauty", "Health & Beauty"] },
      // { name: "Seasonal & Festive", icon: Festive, matchTerms: ["Festive", "Seasonal", "Holidays", "Celebration"] },
      { name: "Corporate", icon: corporateIcon, matchTerms: ["Corporate", "Others"] },
      { name: "Sport", icon: sportIcon, matchTerms: ["Sports", "Sports & Fitness"] },
    ],
    []
  );  

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "businessDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        if (shopData.mode === "Online" && shopData.status === "Active") {
          data.push({ id: doc.id, ...shopData });
        }
      });
      setShops(data);
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle category selection - now only selects one category at a time
  const toggleCategory = (categoryName) => {
    if (selectedCategory === categoryName) {
      // If clicking on the already selected category, deselect it
      setSelectedCategory("");
    } else {
      // Otherwise, select the new category
      setSelectedCategory(categoryName);
    }
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Filter stores based on search term and selected category
  const filteredStores = useMemo(() => {
    if (!stores) return [];

    let filtered = stores.filter((store) =>
      store.merchant?.toLowerCase().includes(storeSearchTerm.toLowerCase())
    );

    if (selectedCategory) {
      // Find the category object to get its match terms
      const categoryObj = categories.find(cat => cat.name === selectedCategory);
      if (categoryObj) {
        filtered = filtered.filter(store => {
          // Check if store has a category property
          if (!store.category) return false;

          // Split the category string into individual categories
          const storeCategories = store.category.split(',');

          // Check if any of the store's categories match any of the category's match terms
          return categoryObj.matchTerms.some(matchTerm =>
            storeCategories.some(storeCategory =>
              storeCategory.trim().toLowerCase() === matchTerm.toLowerCase()
            )
          );
        });
      }
    }

    return filtered;
  }, [stores, storeSearchTerm, selectedCategory, categories]);

  // Calculate pagination for stores
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);
  const totalStorePages = Math.ceil(filteredStores.length / storesPerPage);

  // Filter services based on search term
  const filteredShops = shops.filter((shop) =>
    shop.businessName.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  // Only show 3 services by default
  const visibleShops = showAllStores ? filteredShops : filteredShops.slice(0, 3);
  const hasMoreShops = filteredShops.length > 3;

  // Handle search term changes based on active tab
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    if (activeTab === "store") {
      setStoreSearchTerm(searchValue);
    } else {
      setServiceSearchTerm(searchValue);
    }
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Get current search term based on active tab
  const getCurrentSearchTerm = () => {
    return activeTab === "store" ? storeSearchTerm : serviceSearchTerm;
  };

  // Handle page change
  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalStorePages) {
      setCurrentPage(pageNumber);
      // Scroll to top when changing page
      window.scrollTo({
        top: document.getElementById('stores-section')?.offsetTop - 100 || 0,
        behavior: 'smooth'
      });
    }
  };

  // Function to track a click/purchase
  const trackPurchase = async (storeData, clickId) => {
    try {
      // Create a record in Firebase for tracking
      await addDoc(collection(db, "transactions"), {
        userId: userId,
        storeId: storeData.id,
        storeName: storeData.merchant,
        clickDate: new Date(),
        status: "pending", // Initial status is pending
        saleAmount: 0, // Will be updated by callback or reports API
        commission: 0, // Will be updated later
        // trackingId: Math.random().toString(36).substring(2, 15), // Generate a unique ID
        clickId: clickId, // Store the unique clickId
        subId: userId, // Keep this for backward compatibility
        lastUpdated: serverTimestamp(),
      });

      console.log("Purchase tracking initiated");
    } catch (error) {
      console.error("Error tracking purchase:", error);
    }
  };

  // Function to fetch transactions for the current user
  const fetchTransactions = useCallback(async () => {
    try {
      const q = query(collection(db, "transactions"), where("userId", "==", userId));

      // Set up a real-time listener for transactions
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const transactionsData = [];
        querySnapshot.forEach((doc) => {
          transactionsData.push({ id: doc.id, ...doc.data() });
        });
        setTransactions(transactionsData);
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe;
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  // Call fetchTransactions on component mount
  useEffect(() => {
    if (userId) {
      const unsubscribe = fetchTransactions();
      // Clean up subscription on unmount
      return () => unsubscribe;
    }
  }, [userId, fetchTransactions]);

  // Pagination UI component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        // If we have 5 or fewer pages, show all page numbers
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Always show first page
        pageNumbers.push(1);

        // Calculate the range of pages to display
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Ensure we always show 3 pages in the middle
        if (endPage - startPage < 2) {
          if (currentPage < totalPages / 2) {
            // Near the start, extend endPage
            endPage = Math.min(startPage + 2, totalPages - 1);
          } else {
            // Near the end, extend startPage
            startPage = Math.max(endPage - 2, 2);
          }
        }

        // Add ellipsis after page 1 if needed
        if (startPage > 2) {
          pageNumbers.push('...');
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }

        // Always show last page
        pageNumbers.push(totalPages);
      }

      return pageNumbers;
    };

    return (
      <div className="flex items-center justify-center space-x-2 my-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-1 rounded ${currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          <FiChevronLeft size={16} />
          <span className="ml-1">Prev</span>
        </button>

        {getPageNumbers().map((pageNum, index) => (
          <button
            key={index}
            onClick={() => typeof pageNum === 'number' ? onPageChange(pageNum) : null}
            className={`w-8 h-8 flex items-center justify-center rounded ${pageNum === currentPage
                ? 'bg-teal-500 text-white'
                : pageNum === '...'
                  ? 'cursor-default'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-1 rounded ${currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          <span className="mr-1">Next</span>
          <FiChevronRight size={16} />
        </button>
      </div>
    );
  };

  // Modify the store link rendering to include tracking
  const renderStoreLink = (item) => {
    // Check if userId exists
    if (!userId) {
      // Return the component without the redirect functionality
      return (
        <div
          className="p-5 w-full md:w-[200px]"
          style={{
            boxShadow:
              "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
          }}
          key={item.id}
        >
          <div onClick={() => toast.error("Please login as an user to continue")}>
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
              Earn up to {item?.payout} cashback on each purchase.
            </button>
          </div>
        </div>
      );
    }
  
    // If userId exists, proceed with the original functionality
    // Generate a unique click ID
    const clickId = `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
    const trackingUrl = `https://inr.deals/track?id=${import.meta.env.VITE_INRDEALS_USERNAME}&src=shoppinessmart&url=${item.url}&subid=${clickId}`;
  
    return (
      <div
        className="p-5 w-full md:w-[200px]"
        style={{
          boxShadow:
            "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
        }}
        key={item.id}
      >
        <a
          href={trackingUrl} // Use the tracking URL
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackPurchase(item, clickId)}
        >
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
            Earn up to {item?.payout} cashback on each purchase.
          </button>
        </a>
      </div>
    );
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="overflow-hidden px-4">
      {/* Carousel Section */}
      <div className="w-full">
        {carouselImages.length > 0 ? (
          <Carousel
            img1={carouselImages[0]}
            img2={carouselImages[1] || carouselImages[0]}
            img3={carouselImages[2] || carouselImages[0]}
            autoRotate={true}
            rotationInterval={5000}
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between py-4 bg-white shadow-sm">
        <div className="flex flex-row md:flex-wrap items-center gap-6 md:gap-2 mb-4 md:mb-0 mt-4">
          <div className="hidden md:block bg-black text-white text-sm py-2 px-4 rounded cursor-pointer">
            SAVINGS MODE &rarr;
          </div>
          <div
            className={`text-center py-2 px-2 md:px-4 rounded cursor-pointer text-sm ${activeTab === "store" ? "bg-teal-500 text-white" : ""
              }`}
            onClick={() => handleTabClick("store")}
          >
            Savings by Store
          </div>
          <div
            className={`text-center py-2 px-2 md:px-4 rounded cursor-pointer text-sm border-2 border-500-red ${activeTab === "services" ? "bg-teal-500 text-white" : ""
              }`}
            onClick={() => handleTabClick("services")}
          >
            Savings by Services
          </div>
        </div>
        <div className="flex items-center w-full md:w-auto mt-4">
          <div className="relative w-full">
            <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab === "store" ? "stores" : "services"
                }...`}
              className="pl-10 pr-4 py-2 w-full rounded bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={getCurrentSearchTerm()}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      {activeTab === "store" ? (
        <div id="stores-section">
          <div className="max-w-3xl mx-auto my-6 p-6 border-4 border-yellow-400 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <div className="absolute -top-10 -left-2">
                <div className="bg-yellow-400 text-blue-800 font-bold px-4 py-1 rounded-full text-sm animate-pulse">
                  IMPORTANT
                </div>
              </div>

              <h3 className="text-xl font-bold text-blue-800 mb-3 pt-2">Cashback Distribution Policy</h3>

              <p className="text-gray-800 font-medium leading-relaxed">
                For each transaction, <span className="bg-yellow-200 px-1 font-bold">50% of the cashback earned</span> (up to the percentage mentioned for each store) will be credited to the user, while the <span className="bg-yellow-200 px-1 font-bold">remaining 50% will be retained by ShoppinessMart</span>.
              </p>

              <div className="mt-4 flex justify-center">
                <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>
          {stores === null ? (
            <Loader />
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4 p-4 md:p-10">
              {/* Categories Section with Single Selection */}
              <div className="w-full flex flex-wrap justify-evenly gap-2 mb-6">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    onClick={() => toggleCategory(category.name)}
                    className={`flex flex-col items-center w-[30%] sm:w-[22%] md:w-1/5 lg:w-1/6 p-2 cursor-pointer transition-all duration-300 
                    ${selectedCategory === category.name
                        ? "bg-orange-100 rounded-lg shadow-md transform scale-105"
                        : ""
                      }`}
                  >
                    <div className={`p-2 rounded-full ${selectedCategory === category.name ? "bg-orange-100" : "bg-[#F7F7F7]"}`}>
                      <img
                        src={category.icon}
                        alt={category.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full object-cover"
                      />
                    </div>
                    <span className="text-gray-700 text-center text-xs sm:text-sm font-medium mt-2 line-clamp-2">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Show category selection info */}
              {selectedCategory && (
                <div className="w-full text-center mb-4">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    Filtering by: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="ml-2 text-orange-800 hover:text-orange-900"
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}

              {/* Display store count and pagination info */}
              {filteredStores.length > 0 && (
                <div className="w-full text-center mb-4">
                  <p className="text-gray-600">
                    Showing {indexOfFirstStore + 1}-{Math.min(indexOfLastStore, filteredStores.length)} of {filteredStores.length} stores
                  </p>
                </div>
              )}

              {filteredStores.length === 0 ? (
                <div className="text-center w-full py-8">
                  <p className="text-gray-500">No stores found for {selectedCategory || "your search"}</p>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="mt-2 text-blue-500 hover:underline"
                    >
                      Clear category filter
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap justify-center gap-4">
                    {currentStores.map((item) => renderStoreLink(item))}
                  </div>

                  {/* Add pagination controls */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalStorePages}
                    onPageChange={changePage}
                  />
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          {loading ? (
            <Loader />
          ) : (
            <div className="container mx-auto px-4 py-8">
              {/* Important Notice - Always at the top */}
              <div className="max-w-3xl mx-auto mb-10">
                <div className="p-6 border-4 border-yellow-400 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg">
                  <div className="relative">
                    <div className="absolute -top-10 left-0">
                      <div className="bg-yellow-400 text-blue-800 font-bold px-4 py-1 rounded-full text-sm animate-pulse">
                        IMPORTANT
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-blue-800 mb-3 pt-2">Cashback Distribution Policy</h3>

                    <p className="text-gray-800 font-medium leading-relaxed">
                      For each transaction, <span className="bg-yellow-200 px-1 font-bold">50% of the cashback earned</span> will be credited to the user, while the <span className="bg-yellow-200 px-1 font-bold">remaining 50% will be retained by ShoppinessMart</span>.
                    </p>

                    <div className="mt-4 flex justify-center">
                      <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stores Section */}
              <h2 className="text-2xl font-bold text-center mb-8">Our Partner Stores</h2>

              {filteredShops.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-lg text-gray-600">No stores found</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleShops.map((item) => (
                      <Link
                        to={
                          location.pathname.includes("/user-dashboard")
                            ? `/user-dashboard/${userId}/online-shop/${item.id}`
                            : `/online-shop/${item.id}`
                        }
                        key={item.id}
                        state={{ activeTab: "services" }}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={item.bannerUrl}
                            alt={item.businessName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="font-semibold text-xl text-gray-800">{item.businessName}</p>
                          <p className="my-2 text-gray-600">{item.location}</p>
                          <span className="inline-block bg-blue-600 text-white rounded-lg px-3 py-1 text-sm font-medium">
                            {item.rate}% Cashback
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* View More / Less Button */}
                  {hasMoreShops && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={() => setShowAllStores(!showAllStores)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                      >
                        {showAllStores ? (
                          <>
                            Show Less <FiChevronUp size={20} />
                          </>
                        ) : (
                          <>
                            View More ({filteredShops.length - 3} more stores) <FiChevronDown size={20} />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineShop;