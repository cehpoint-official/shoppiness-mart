import { useState, useEffect, useCallback } from "react";
// import shopcard from "../assets/Shop/shopcard.png";
// import onlineShopHeader from "../assets/onlineShopHeader.png";
import Loader from "../Components/Loader/Loader";
import Carousel from "../Components/Carousel/Carousel";
import { FiSearch } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, addDoc, query, where, onSnapshot, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const OnlineShop = () => {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState(null);
  const [activeTab, setActiveTab] = useState("store");
  const [shops, setShops] = useState([]);
  const [storeSearchTerm, setStoreSearchTerm] = useState("");
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const { userId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);

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
          setStores(data.data.stores);
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

  // Separate filter functions for stores and services
  const filteredStores =
    stores?.filter((store) =>
      store.merchant?.toLowerCase().includes(storeSearchTerm.toLowerCase())
    ) || [];

  const filteredShops = shops.filter((shop) =>
    shop.businessName.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  // Handle search term changes based on active tab
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    if (activeTab === "store") {
      setStoreSearchTerm(searchValue);
    } else {
      setServiceSearchTerm(searchValue);
    }
  };

  // Get current search term based on active tab
  const getCurrentSearchTerm = () => {
    return activeTab === "store" ? storeSearchTerm : serviceSearchTerm;
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

  // Modify the store link rendering to include tracking
  const renderStoreLink = (item) => {
    // Generate a unique click ID
    const clickId = `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Construct the tracking URL
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
            {item?.payout} cashback - All to charity.
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
            onClick={() => setActiveTab("store")}
          >
            Savings by Store
          </div>
          <div
            className={`text-center py-2 px-2 md:px-4 rounded cursor-pointer text-sm border-2 border-500-red ${activeTab === "services" ? "bg-teal-500 text-white" : ""
              }`}
            onClick={() => setActiveTab("services")}
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
        <div>
          {stores === null ? (
            <Loader />
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4 p-4 md:p-10">
              {filteredStores.length === 0 ? (
                <div className="text-center">No stores found</div>
              ) : (
                filteredStores.map((item) => renderStoreLink(item))
              )}
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
                <div className="text-center">No services found</div>
              ) : (
                filteredShops.map((item) => (
                  <Link
                    to={
                      location.pathname.includes("/user-dashboard")
                        ? `/user-dashboard/${userId}/online-shop/${item.id}`
                        : `/online-shop/${item.id}`
                    }
                    key={item.id}
                  >
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
                  </Link>
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