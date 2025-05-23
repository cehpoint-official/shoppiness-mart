import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./Sidebar.scss";
import { IoLogOutOutline } from "react-icons/io5";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { TbFlower } from "react-icons/tb";
import { AiOutlineCalendar } from 'react-icons/ai';
import { AiOutlinePlus } from 'react-icons/ai';
import headerLogo from "../../assets/header-logo.png";
import iconDashboard from "../../assets/icon-dashboard.png";
import iconProducts from "../../assets/icon-products.png";
import iconCustomers from "../../assets/icon-customers.png";
import iconPOS from "../../assets/icon-pos.png";
import iconInvoices from "../../assets/icon-invoice.png";
import iconSales from "../../assets/icon-sales.png";
import iconShop from "../../assets/icon-shop.png";
import iconLogout from "../../assets/icon-logout.png";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ngoUserNotExist } from "../../../redux/reducer/ngoUserReducer";
import { persistor } from "../../../redux/store";

const Sidebar = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const LogoutDialog = () => {
    if (!showLogoutDialog) return null;

    const handleLogout = async () => {
      try {
        // Step 1: Clear the Redux state
        dispatch(ngoUserNotExist());
        // Step 2: Purge the persisted state from sessionStorage
        await persistor.purge().then(() => {
          // Step 3: Navigate to login page after purge completes
          navigate("/login/cause");
        });
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:w-80 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#F95151] flex items-center justify-center mb-3 sm:mb-4">
              <IoLogOutOutline className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-center">
              Are you sure! You want to log out
            </h3>
            <div className="flex gap-3 sm:gap-4 w-full justify-center">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-[#048c7e] text-white"
        >
          {isMobileMenuOpen ? (
            <IoClose className="w-6 h-6" />
          ) : (
            <HiMenuAlt2 className="w-6 h-6 " />
          )}
        </button>
      </div>

      {/* Sidebar - Hidden on small screens, shown when menu is toggled */}
      <div
        className={`sidebar ${isMobileMenuOpen ? "block  fixed top-0 left-0" : "hidden"
          } lg:block h-full z-30`}
      >
        <div className="logo">
          <Link to={`/ngo-dashboard/${id}/dashboard`}>
            <img src={headerLogo} alt="loading" />
          </Link>
        </div>
        <hr />
        <ul>
          <Link to={`/ngo-dashboard/${id}/dashboard`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/dashboard`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <img src={iconDashboard} alt="loading" />
              Dashboard
            </li>
          </Link>

          <Link to={`/ngo-dashboard/${id}/details`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/details`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <img src={iconProducts} alt="loading" />
              Cause/NGO Details
            </li>
          </Link>

          <Link to={`/ngo-dashboard/${id}/performance`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/performance`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <img src={iconCustomers} alt="loading" />
              Cause/NGO Performance
            </li>
          </Link>

          <Link to={`/ngo-dashboard/${id}/gallery`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/gallery`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <TbFlower size={20} />
              Gallery
            </li>
          </Link>

          <Link to={`/ngo-dashboard/${id}/pastEvents`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/pastEvents`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <AiOutlineCalendar size={24} />
              Past Events
            </li>
          </Link>

          <Link to={`/ngo-dashboard/${id}/addCause`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/addCause`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <AiOutlinePlus size={24} />
              Add Cause
            </li>
          </Link>

          <Link to={`/ngo-dashboard/${id}/support`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/support`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <img src={iconPOS} alt="loading" />
              Help & Support
            </li>
          </Link>

          <Link to={`/ngo-dashboard/${id}/about-us`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/about-us`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <img src={iconInvoices} alt="loading" />
              About Us
            </li>
          </Link>

          {/* <Link to={`/ngo-dashboard/${id}/faqs`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/faqs`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <img src={iconSales} alt="loading" />
              FAQs
            </li>
          </Link> */}

          {/* <Link to={`/ngo-dashboard/${id}/privacy-policy`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/privacy-policy`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <img src={iconShop} alt="loading" />
              Privacy Policy
            </li>
          </Link> */}

          <li
            className={
              activeLink === `/ngo-dashboard/${id}/logout`
                ? "bg-[#ffffff33]"
                : ""
            }
            onClick={() => setShowLogoutDialog(true)}
          >
            <img src={iconLogout} alt="loading" />
            Log Out
          </li>
        </ul>
      </div>

      {/* Overlay for mobile menu - only shows when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      <LogoutDialog />
    </>
  );
};

export default Sidebar;
