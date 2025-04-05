import { Link, useLocation, useParams } from "react-router-dom";
import Loader from "./Loader/Loader";

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
  return (
    <div>
      <div className="mt-10 mx-auto px-4 md:px-40 bg-[#EEFAF9] py-12 mb-40">
        <div>
          <h1 className="font-bold md:text-4xl text-2xl text-center font-slab">
            {title}
          </h1>
          <p className="text-gray-600 md:text-xl text-sm text-center mx-auto md:mt-8 mt-4">
            {para}
          </p>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {" "}
            <div>
              <div className="text-[#047E72] font-medium text-lg text-center md:mt-10 mt-4">
                Online partners
              </div>
              <div className="flex justify-center items-center flex-wrap md:gap-9 gap-4">
                {onlineShops.length > 0 ? (
                  onlineShops.map((shop) => (
                    <Link
                      to={getShopLink(shop)}
                      key={shop.id}
                      className="mt-6 text-center"
                    >
                      <div className="w-[150px] h-[150px] md:w-[150px] md:h-[150px] sm:w-[120px] sm:h-[120px] xs:w-[100px] xs:h-[100px]  flex items-center justify-center">
                        <img
                          src={shop.logoUrl}
                          alt={shop.businessName}
                          className="w-full h-full object-contain "
                        />
                      </div>
                      <p className="font-semibold mt-2">{shop.businessName}</p>
                    </Link>
                  ))
                ) : (
                  <p className="mt-6 text-center">
                    No online shops found in this rate range
                  </p>
                )}
              </div>
            </div>
            <div className="mt-20">
              <div className="text-[#047E72] font-medium text-lg text-center md:mt-10 mt-4">
                Offline partners
              </div>
              <div className="flex justify-center items-center flex-wrap md:gap-9 gap-4">
                {offlineShops.length > 0 ? (
                  offlineShops.map((shop) => (
                    <div key={shop.id} className="mt-6 text-center">
                      <div className="w-[150px] h-[150px] md:w-[150px] md:h-[150px] sm:w-[120px] sm:h-[120px] xs:w-[100px] xs:h-[100px] flex items-center justify-center">
                        <img
                          src={shop.logoUrl}
                          alt={shop.businessName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="font-semibold mt-2">{shop.businessName}</p>
                    </div>
                  ))
                ) : (
                  <p className="mt-6 text-center">
                    No offline shops found in this rate range
                  </p>
                )}
              </div>
            </div>
            <div className="text-center mt-20">
              <Link to="/all-partners" className="hover:text-[#047E72]">
                {" "}
                <p className="text-xl">
                  See all <span className="font-bold">{totalShopsInRange}</span>{" "}
                  Platforms <i className="bi bi-arrow-right"></i>{" "}
                </p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Partners;
