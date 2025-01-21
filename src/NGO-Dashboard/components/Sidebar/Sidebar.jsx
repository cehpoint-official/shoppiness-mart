import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./Sidebar.scss";
import { IoLogOutOutline } from "react-icons/io5";
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

const Sidebar = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const LogoutDialog = () => {
    if (!showLogoutDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-[#F95151] flex items-center justify-center mb-4">
              <IoLogOutOutline className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium mb-4">
              Are you sure! You want to log out
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(ngoUserNotExist());
                  navigate("/login/cause");
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
      <div className="sidebar">
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

          <Link to={`/ngo-dashboard/${id}/customers`}>
            <li
              className={
                activeLink === `/ngo-dashboard/${id}/customers`
                  ? "bg-[#ffffff33]"
                  : ""
              }
            >
              <img src={iconCustomers} alt="loading" />
              Cause/NGO Performance
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
              Support
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

          <Link to={`/ngo-dashboard/${id}/faqs`}>
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
          </Link>

          <Link to={`/ngo-dashboard/${id}/privacy-policy`}>
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
          </Link>

          <li
            className={
              activeLink === `/ngo-dashboard/${id}/logout` ? "bg-[#ffffff33]" : ""
            }
            onClick={() => setShowLogoutDialog(true)}
          >
            <img src={iconLogout} alt="loading" />
            Log Out
          </li>
        </ul>
      </div>
      <LogoutDialog />
    </>
  );
};

export default Sidebar;