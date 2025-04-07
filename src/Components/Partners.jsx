import { Link, useLocation, useParams } from "react-router-dom";
import Loader from "./Loader/Loader";
import { BadgePercent, ShoppingCart, CreditCard, TrendingUp, ShieldCheck, Users } from "lucide-react";

// eslint-disable-next-line react/prop-types
const Partners = ({ title, para, shopsData, isLoading }) => {
  const { userId } = useParams();

  // Get location to check if we're in user dashboard
  const location = useLocation();
  const isUserDashboard = location.pathname.includes("/user-dashboard");

  // Filter and sort online shops
  const onlineShops = shopsData
    .filter(
      (shop) =>
        shop.mode === "Online" &&
        parseInt(shop.rate) >= 20 &&
        parseInt(shop.rate) <= 50
    )
    .sort((a, b) => parseInt(b.rate) - parseInt(a.rate))
    .slice(0, 5);

  // Filter and sort offline shops
  const offlineShops = shopsData
    .filter(
      (shop) =>
        shop.mode === "Offline" &&
        parseInt(shop.rate) >= 20 &&
        parseInt(shop.rate) <= 50
    )
    .sort((a, b) => parseInt(b.rate) - parseInt(a.rate))
    .slice(0, 5);

  // Calculate total number of shops in the range (without the slice limit)
  const totalShopsInRange = shopsData.filter(
    (shop) =>
      (shop.mode === "Online" || shop.mode === "Offline") &&
      parseInt(shop.rate) >= 20 &&
      parseInt(shop.rate) <= 50
  ).length;

  // Generate shop link based on shop mode and user dashboard status
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
  
  const userBenefits = [
    {
      icon: <BadgePercent className="w-6 h-6 text-[#047E72]" />,
      title: "Higher Cashback",
      description: "Earn up to 25% cashback on every purchase from our preferred partners"
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-[#047E72]" />,
      title: "Increased Impact",
      description: "More cashback means more to give back to charities and causes you care about"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#047E72]" />,
      title: "Trusted Quality",
      description: "Our preferred partners are vetted for quality products and reliable service"
    }
  ];
  
  const businessBenefits = [
    {
      icon: <CreditCard className="w-6 h-6 text-[#047E72]" />,
      title: "Faster Payouts",
      description: "Receive your commission payments more quickly with our expedited process"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#047E72]" />,
      title: "Higher Commission",
      description: "Earn more on each sale compared to standard partnership tiers"
    },
    {
      icon: <Users className="w-6 h-6 text-[#047E72]" />,
      title: "Increased Visibility",
      description: "Get featured placement and priority in our marketplace"
    }
  ];

  return (
    <div className="bg-white">
      <div className="mt-10 mx-auto px-4 md:px-40 bg-[#EEFAF9] py-12 mb-12 rounded-xl shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-12">
            <h1 className="font-bold md:text-4xl text-2xl text-center font-slab">
              {title}
            </h1>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#047E72] rounded-full"></div>
          </div>
          <p className="text-gray-700 md:text-xl text-sm text-center mx-auto md:mt-8 mt-4 leading-relaxed">
            {para}
          </p>
        </div>
        
        {/* User Benefits Section */}
        <div className="mt-12 mb-16 bg-white rounded-xl p-6 shadow-sm max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Why Shop with Our Preferred Partners?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {userBenefits.map((benefit, index) => (
              <div key={index} className="p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300 bg-white">
                <div className="rounded-full bg-[#EEFAF9] w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Online Partners Section */}
            <div className="mt-12">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-[#047E72]"></div>
                <h2 className="text-[#047E72] font-semibold text-xl text-center">Online Preferred Partners</h2>
                <div className="h-[1px] w-12 bg-[#047E72]"></div>
              </div>
              <div className="flex justify-center items-center flex-wrap md:gap-9 gap-4">
                {onlineShops.length > 0 ? (
                  onlineShops.map((shop) => (
                    <Link
                      to={getShopLink(shop)}
                      key={shop.id}
                      className="group mt-6 text-center"
                    >
                      <div className="w-[150px] h-[150px] md:w-[150px] md:h-[150px] sm:w-[120px] sm:h-[120px] xs:w-[100px] xs:h-[100px] flex items-center justify-center p-4 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300">
                        <img
                          src={shop.logoUrl}
                          alt={shop.businessName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="font-semibold mt-3 group-hover:text-[#047E72] transition-colors duration-300">{shop.businessName}</p>
                      <span className="inline-block px-2 py-1 bg-[#047E72]/10 text-[#047E72] text-xs font-medium rounded-full mt-1">
                        {shop.rate/2}% Cashback
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="mt-6 text-center p-4 bg-white rounded-lg shadow-sm">
                    No online shops found in this rate range
                  </p>
                )}
              </div>
            </div>
            
            {/* Offline Partners Section */}
            <div className="mt-20">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-[#047E72]"></div>
                <h2 className="text-[#047E72] font-semibold text-xl text-center">Offline Preferred Partners</h2>
                <div className="h-[1px] w-12 bg-[#047E72]"></div>
              </div>
              <div className="flex justify-center items-center flex-wrap md:gap-9 gap-4">
                {offlineShops.length > 0 ? (
                  offlineShops.map((shop) => (
                    <Link
                      to={getShopLink(shop)}
                      key={shop.id}
                      className="group mt-6 text-center"
                    >
                      <div className="w-[150px] h-[150px] md:w-[150px] md:h-[150px] sm:w-[120px] sm:h-[120px] xs:w-[100px] xs:h-[100px] flex items-center justify-center p-4 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300">
                        <img
                          src={shop.logoUrl}
                          alt={shop.businessName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="font-semibold mt-3 group-hover:text-[#047E72] transition-colors duration-300">{shop.businessName}</p>
                      <span className="inline-block px-2 py-1 bg-[#047E72]/10 text-[#047E72] text-xs font-medium rounded-full mt-1">
                        {shop.rate/2}% Cashback
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="mt-6 text-center p-4 bg-white rounded-lg shadow-sm">
                    No offline shops found in this rate range
                  </p>
                )}
              </div>
            </div>
            
            {/* Business Benefits Section */}
            <div className="mt-16 mb-12 bg-white rounded-xl p-6 shadow-sm max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Why Become a Preferred Partner?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {businessBenefits.map((benefit, index) => (
                  <div key={index} className="p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300 bg-white">
                    <div className="rounded-full bg-[#EEFAF9] w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                      {benefit.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-center">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center mt-16 bg-[#047E72] text-white py-8 px-6 rounded-xl max-w-3xl mx-auto shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Discover All Our Amazing Partners</h3>
              <p className="mb-6 text-white/90">Join our community of satisfied shoppers and impactful givers today!</p>
              <Link 
                to="/all-partners" 
                className="inline-flex items-center gap-2 bg-white text-[#047E72] font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-md"
              >
                See all <span className="font-bold">{totalShopsInRange}</span> Partners 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Partners;
