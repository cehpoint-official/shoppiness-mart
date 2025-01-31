import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import ShoppingBag from "../../../assets/ShoppingBag.png";

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({
    shoppiness: false,
    maast: false,
    ngo: false,
    product: false,
    users: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-[320px] bg-[#059d8e] min-h-screen text-white">
      <div className="py-4 px-6">
        <Link to="/" className="text-2xl font-bold">
          <img src={ShoppingBag} alt="" />
        </Link>
      </div>

      <nav className="flex flex-col py-4">
        <Link
          to="/admin/shoppiness/dashboard"
          className="py-2 px-6 hover:bg-teal-600 transition-colors"
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
                to="/admin/shoppiness/edit-pages"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Edit Pages
              </Link>
              <Link
                to="/admin/shoppiness/contact"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Contact Info
              </Link>
              <Link
                to="/admin/shoppiness/social-media"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Social media
              </Link>
              <Link
                to="/admin/shoppiness/blog"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/admin/shoppiness/add/privacy-policy"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Privacy polices
              </Link>
              <Link
                to="/admin/shoppiness/faq"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                FAQs
              </Link>
              <Link
                to="/admin/shoppiness/newsletter"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
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
              <Link
                to="/maast/edit"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Edit Page
              </Link>
              <Link
                to="/maast/donations"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                View Donations
              </Link>
              <Link
                to="/maast/events"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
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
                to="/products/requests"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Product & Services Requests
              </Link>
              <Link
                to="/products/all"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                All Product & Services
              </Link>
              <Link
                to="/products/categories"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Add Categories
              </Link>
              <Link
                to="/products/add"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Add Product & Services
              </Link>
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
                to="/ngo/requests"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                NGO/Causes Requests
              </Link>
              <Link
                to="/ngo/all"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                All NGO/Causes
              </Link>
              <Link
                to="/ngo/add"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Add NGO/Causes
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
                to="/admin/shoppiness/users/coupons"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Coupons
              </Link>
              <Link
                to="/admin/shoppiness/users/cashback-requests"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                 Cashback Requests
              </Link>
              <Link
                to="/admin/shoppiness/users/cashback-status"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
               Cashback Status
              </Link>
              <Link
                to="/admin/shoppiness/users/givebacks"
                className="py-2 px-6 hover:bg-teal-600 transition-colors"
              >
                Give backs
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
