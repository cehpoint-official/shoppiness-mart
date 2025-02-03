import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import "./Sidebar.scss";
import headerLogo from "../../assets/header-logo.png";
import iconDashboard from "../../assets/icon-dashboard.png";
import iconProducts from "../../assets/icon-products.png";
import iconCustomers from "../../assets/icon-customers.png";
import iconPOS from "../../assets/icon-pos.png";
import iconInvoices from "../../assets/icon-invoice.png";
import iconLogout from "../../assets/icon-logout.png";
import { businessUserExist } from "../../../redux/reducer/businessUserReducer";

const Sidebar = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
              Are you sure you want to log out?
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
                  dispatch(businessUserExist());
                  navigate("/login/business");
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

          {/* <Link to={`/services-dashboard/${id}/sales-record`}>
            <li>
              <img src={iconSales} alt="loading" />
              Sales Record
            </li>
          </Link> */}

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
      <LogoutDialog />
    </>
  );
};

export default Sidebar;
