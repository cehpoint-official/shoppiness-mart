import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Carousel from "../../Components/Carousel/Carousel";
import { MdOutlineArrowRightAlt, MdStorefront } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { BsShop } from "react-icons/bs";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";

const CashbackDeals = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.userReducer);
  const userId = user?.uid || "";

  const [cashbackDeals, setCashbackDeals] = useState([]);
  const [offlineDeals, setOfflineDeals] = useState([]);
  const [onlineDeals, setOnlineDeals] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [showAllOffline, setShowAllOffline] = useState(false);
  const [showAllOnline, setShowAllOnline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch carousel images from db
        const contentDocRef = doc(db, "content", "cashbackdealsBanners");
        const contentDocSnap = await getDoc(contentDocRef);

        if (contentDocSnap.exists()) {
          const contentDocData = contentDocSnap.data() || {};
          const sortedBanners = Object.values(contentDocData).sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });                          

          const topThreeBanners = sortedBanners[0].slice(0, 3).map(banner => banner.url);
          setCarouselImages(topThreeBanners);
        }

        const cashbackDealsRef = collection(db, "cashbackDeals");
        const querySnapshot = await getDocs(cashbackDealsRef);

        const dealsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCashbackDeals(dealsData);

        const offline = dealsData.filter(deal => deal.shopMode === "Offline");
        const online = dealsData.filter(deal => deal.shopMode === "Online");

        setOfflineDeals(offline);
        setOnlineDeals(online);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to toggle showing all offline deals
  const toggleOfflineDeals = () => {
    setShowAllOffline(!showAllOffline);
  };

  // Function to toggle showing all online deals
  const toggleOnlineDeals = () => {
    setShowAllOnline(!showAllOnline);
  };

  // Function to format cashback display based on cashbackType
  const formatCashback = (amount, type) => {
    if (type === "percentage") {
      return `${amount}% OFF`;
    } else if (type === "fixed") {
      return `₹${amount} OFF`;
    }
    return `${amount} OFF`;
  };

  // Function to calculate final price based on cashbackType
  const calculateFinalPrice = (deal) => {
    if (deal.cashbackType === "percentage") {
      return (deal.productPrice - (deal.productPrice * (deal.cashbackAmount / 100))).toFixed(2);
    } else if (deal.cashbackType === "fixed") {
      return (deal.productPrice - deal.cashbackAmount).toFixed(2);
    }
    return deal.productPrice;
  };

  // Limit the number of deals displayed initially
  const displayedOfflineDeals = showAllOffline ? offlineDeals : offlineDeals.slice(0, 3);
  const displayedOnlineDeals = showAllOnline ? onlineDeals : onlineDeals.slice(0, 3);

  return (
    <div className="w-full max-w-full mx-auto px-4 pb-8 font-sans overflow-x-hidden">
      <div className="flex flex-col gap-12">
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

        {/* Offline Deals Section */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg mx-10">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <BsShop className="text-blue-600 text-2xl" />
              <h2 className="text-xl font-semibold text-gray-800">Top Offline Deals</h2>
            </div>
            <div
              className="flex items-center gap-2 text-blue-600 font-medium text-sm cursor-pointer hover:text-blue-700 transition-colors"
              onClick={toggleOfflineDeals}
            >
              {showAllOffline ? "Show Less" : "View More"}
              <MdOutlineArrowRightAlt className={`text-xl transition-transform duration-300 ${showAllOffline ? "rotate-90" : ""}`} />
            </div>
          </div>

          {displayedOfflineDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedOfflineDeals.map((deal, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  <div className="relative h-52">
                    <img
                      src={deal.productImage}
                      alt={deal.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute bottom-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                      <img
                        src={deal.shopBanner}
                        alt={deal.shopName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2 line-clamp-1">{deal.shopName}</h3>
                    <div className="flex justify-between items-center mt-auto mb-4">
                      {deal.cashbackType === "percentage" ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm md:text-lg font-bold text-gray-800">₹ {calculateFinalPrice(deal)}</span>
                          <span className="text-xs md:text-sm text-gray-400 line-through">₹ {Number(deal.productPrice).toFixed(2)}</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm md:text-lg font-bold text-gray-800">₹ {calculateFinalPrice(deal)}</span>
                          <span className="text-xs md:text-sm text-gray-400 line-through">₹ {Number(deal.productPrice).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="bg-red-50 text-red-600 px-1 md:px-3 py-1 rounded text-xs md:text-sm font-semibold">
                        {formatCashback(deal.cashbackAmount, deal.cashbackType)}
                      </div>
                    </div>
                    <Link
                      to={
                        location.pathname.includes("/user-dashboard")
                          ? `/user-dashboard/${userId}/cashback-deals/${deal.productCategory}/${deal.businessId}`
                          : `/cashback-deals/${deal.productCategory}/${deal.businessId}`
                      }
                      className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-lg flex items-center justify-center"
                    >
                      View Deal
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 italic">
              No offline deals available at the moment
            </div>
          )}
        </div>

        {/* Online Deals Section */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg mx-10">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-blue-600 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Best Online Store Offers</h2>
            </div>
            <div
              className="flex items-center gap-2 text-blue-600 font-medium text-sm cursor-pointer hover:text-blue-700 transition-colors"
              onClick={toggleOnlineDeals}
            >
              {showAllOnline ? "Show Less" : "View More"}
              <MdOutlineArrowRightAlt className={`text-xl transition-transform duration-300 ${showAllOnline ? "rotate-90" : ""}`} />
            </div>
          </div>

          {displayedOnlineDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedOnlineDeals.map((deal, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  <div className="relative h-52">
                    <img
                      src={deal.productImage}
                      alt={deal.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute bottom-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                      <img
                        src={deal.shopBanner}
                        alt={deal.shopName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2 line-clamp-2">{deal.shopName}</h3>
                    <div className="flex justify-between items-center mt-auto mb-4">
                      {deal.cashbackType === "percentage" ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm md:text-lg font-bold text-gray-800">₹ {calculateFinalPrice(deal)}</span>
                          <span className="text-xs md:text-sm text-gray-400 line-through">₹ {Number(deal.productPrice).toFixed(2)}</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm md:text-lg font-bold text-gray-800">₹ {calculateFinalPrice(deal)}</span>
                          <span className="text-xs md:text-sm text-gray-400 line-through">₹ {Number(deal.productPrice).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="bg-red-50 text-red-600 px-1 md:px-3 py-1 rounded text-xs md:text-sm font-semibold">
                        {formatCashback(deal.cashbackAmount, deal.cashbackType)}
                      </div>
                    </div>
                    <Link
                      to={
                        location.pathname.includes("/user-dashboard")
                          ? `/user-dashboard/${userId}/cashback-deals/${deal.productCategory}/${deal.businessId}`
                          : `/cashback-deals/${deal.productCategory}/${deal.businessId}`
                      }
                      className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-lg flex items-center justify-center"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 italic">
              No online deals available at the moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashbackDeals;