import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import ShoppingBag from "../../../assets/ShoppingBag.png";

const Sidebar = ({ userId, sidebarOpen, setSidebarOpen }) => {
  const [openSections, setOpenSections] = useState({
    shoppiness: false,
    maast: false,
    ngo: false,
    product: false,
    users: false,
  });
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile initially
    const checkIfMobile = () => {
      const mobileView = window.innerWidth < 1024;
      setIsMobile(mobileView);
      
      // Set sidebar state based on screen size
      if (!mobileView) {
        setSidebarOpen(true);
      }
    };

    // Check on initial load
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [setSidebarOpen]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed lg:relative h-screen z-40 w-[280px] lg:w-[280px] xl:w-[320px]
          bg-[#059d8e] text-white
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          transition-transform duration-300 ease-in-out
          flex-shrink-0
        `}
      >
        <div className="py-4 px-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            <img src={ShoppingBag} alt="ShoppingBag" className="h-10" />
          </Link>
          <button 
            onClick={toggleSidebar} 
            className="lg:hidden text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable sidebar content */}
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          <nav className="flex flex-col py-4">
            <Link
              to={`/admin/${userId}/shoppiness/dashboard`}
              className="py-2 px-6 hover:bg-teal-600 transition-colors"
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              DASHBOARD
            </Link>

            {/* SHOPPINESSMART Section */}
            <div>
              <div
                onClick={() => toggleSection("shoppiness")}
                className="border-b flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600 transition-colors"
              >
                <span>SHOPPINESSMART</span>
                {openSections.shoppiness ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {openSections.shoppiness && (
                <div className="flex flex-col pl-6 bg-teal-700/20">
                  <Link
                    to={`/admin/${userId}/shoppiness/edit-pages`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Edit Pages
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/contact-info`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Contact Info
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/social-media`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Social media
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/blog`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/privacy-policy`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Privacy polices
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/faq`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    FAQs
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/newsletter`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Newsletters
                  </Link>
                </div>
              )}
            </div>

            {/* MAAST Section */}
            <div>
              <div
                onClick={() => toggleSection("maast")}
                className="border-b flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600 transition-colors"
              >
                <span>MAAST</span>
                {openSections.maast ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {openSections.maast && (
                <div className="flex flex-col pl-6 bg-teal-700/20">
                  {/* <Link
                    to={`/admin/${userId}/shoppiness/maast/edit`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Edit Page
                  </Link> */}
                  <Link
                    to={`/admin/${userId}/shoppiness/maast/donations`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    View Donations
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/maast/events`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Events
                  </Link>
                </div>
              )}
            </div>

            {/* PRODUCT/SERVICES Section */}
            <div>
              <div
                onClick={() => toggleSection("product")}
                className="border-b flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600 transition-colors"
              >
                <span>PRODUCT/SERVICES</span>
                {openSections.product ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {openSections.product && (
                <div className="flex flex-col pl-6 bg-teal-700/20">
                  <Link
                    to={`/admin/${userId}/shoppiness/services/offlineshop-requests`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Offline Shop Requests
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/services/onlineshop-requests`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Online Shop Requests
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/services/all-offlineshops`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    All Offline Shops
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/services/all-onlineshops`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    All Online Shops
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/services/earnings`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Earnings From Shops
                  </Link>
                  {/* <Link
                    to={`/admin/${userId}/shoppiness/services/add-categories`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Add Categories
                  </Link> */}
                  {/* <Link
                    to={`/admin/${userId}/shoppiness/services/cashback-tracking`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Cashback Tracking
                  </Link> */}
                </div>
              )}
            </div>

            {/* NGO/CAUSES Section */}
            <div>
              <div
                onClick={() => toggleSection("ngo")}
                className="border-b flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600 transition-colors"
              >
                <span>NGO/CAUSES</span>
                {openSections.ngo ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {openSections.ngo && (
                <div className="flex flex-col pl-6 bg-teal-700/20">
                  <Link
                    to={`/admin/${userId}/shoppiness/ngo/ngo-requests`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    NGO/Causes Requests
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/ngo/all-ngo`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    All NGO/Causes
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/ngo/giveback-request`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Give Back Record
                  </Link>
                </div>
              )}
            </div>

            {/* USERS Section */}
            <div>
              <div
                onClick={() => toggleSection("users")}
                className="border-b flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600 transition-colors"
              >
                <span>USERS</span>
                {openSections.users ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {openSections.users && (
                <div className="flex flex-col pl-6 bg-teal-700/20">
                  <Link
                    to={`/admin/${userId}/shoppiness/users/coupons`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Coupons
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/users/withdrawal-requests`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Withdrawal Requests
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/users/cashback-requests`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Cashback Requests
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/users/cashback-status`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Cashback Status
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/users/givebacks`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Give backs
                  </Link>
                  <Link
                    to={`/admin/${userId}/shoppiness/users/dispute-requests`}
                    className="py-2 px-6 hover:bg-teal-600 transition-colors"
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    Dispute Requests
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;