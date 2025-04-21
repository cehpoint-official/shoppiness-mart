import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { IoLogOutOutline, IoClose } from "react-icons/io5";
import { HiMenuAlt2 } from "react-icons/hi";
import { RiCoupon2Line } from "react-icons/ri";
import { FaCashRegister } from "react-icons/fa"; // Added for cashback icon
import { FiGift } from "react-icons/fi";

import "./Sidebar.scss";
import headerLogo from "../../assets/header-logo.png";
import iconDashboard from "../../assets/icon-dashboard.png";
import iconProducts from "../../assets/icon-products.png";
import iconCustomers from "../../assets/icon-customers.png";
import iconPOS from "../../assets/icon-pos.png";
import iconInvoices from "../../assets/icon-invoice.png";
import iconLogout from "../../assets/icon-logout.png";
import {
  businessUserExist,
  businessUserNotExist,
} from "../../../redux/reducer/businessUserReducer";
import { persistor } from "../../../redux/store";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu
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
        // Step 1: Clear the Redux state by dispatching the proper action
        dispatch(businessUserNotExist());

        // Step 2: Purge the persisted state from sessionStorage
        await persistor.purge().then(() => {
          // Step 3: Navigate to login page after purge completes
          navigate("/login/business");
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
      {isMobileMenuOpen ? (
        <></>
      ) : (
        <>
          {" "}
          <div className="lg:hidden fixed top-4 left-4 z-40">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md bg-[#048c7e] text-white"
            >
              <HiMenuAlt2 className="w-6 h-6" />
            </button>
          </div>
        </>
      )}

      {/* Sidebar - Hidden on small screens, shown when menu is toggled */}
      <div
        className={`sidebar ${isMobileMenuOpen ? "block  fixed top-0 left-0" : "hidden"
          } lg:block h-full z-30 overflow-y-hidden`}
      >
        {/* Close button inside sidebar - only visible on mobile */}
        {isMobileMenuOpen && (
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden absolute top-4 right-4 p-2 text-white hover:text-gray-300"
          >
            <IoClose className="w-6 h-6" />
          </button>
        )}

        <div className="logo">
          <Link to={`/services-dashboard/${id}/dashboard`}>
            <img src={headerLogo} alt="loading" />
          </Link>
        </div>
        <hr />
        <ul>
          <Link to={`/services-dashboard/${id}/dashboard`}>
            <li>
              <img src={iconDashboard} alt="loading" />
              Dashboard
            </li>
          </Link>

          <Link to={`/services-dashboard/${id}/products`}>
            <li>
              <img src={iconProducts} alt="loading" />
              Products/Services
            </li>
          </Link>

          <Link to={`/services-dashboard/${id}/customers`}>
            <li>
              <img src={iconCustomers} alt="loading" />
              Customers
            </li>
          </Link>

          <Link to={`/services-dashboard/${id}/money-send`}>
            <li>
              <img src={iconCustomers} alt="loading" />
              Send Money To Platform
            </li>
          </Link>

          <Link to={`/services-dashboard/${id}/coupons`}>
            <li>
              <RiCoupon2Line className="w-5 h-5" />
              Generated Coupons
            </li>
          </Link>

          <Link to={`/services-dashboard/${id}/cashback`}>
            <li>
              <FiGift className="w-5 h-5" />
              Cashback Deals
            </li>
          </Link>

          <Link to={`/services-dashboard/${id}/pos`}>
            <li>
              <img src={iconPOS} alt="loading" />
              POS
            </li>
          </Link>

          <Link to={`/services-dashboard/${id}/invoices`}>
            <li>
              <img src={iconInvoices} alt="loading" />
              Invoices
            </li>
          </Link>

          <Link to={`/services-dashboard/${id}/shopinfo`}>
            <li>
              <img src={iconCustomers} alt="loading" />
              Shop Info
            </li>
          </Link>

          <li onClick={() => setShowLogoutDialog(true)}>
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