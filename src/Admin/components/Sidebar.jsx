// Sidebar.js
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import ShoppingBag from "../../assets/ShoppingBag.png";
const Sidebar = () => {
  const [isMaastOpen, setIsMaastOpen] = useState(false);
  const [isNgoOpen, setIsNgoOpen] = useState(false);
  const [isShoppinessOpen, setIsShoppinessOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);

  return (
    <div className="w-64 bg-[#059d8e] min-h-screen text-white">
      <div className="py-4 px-6">
        <Link to="/" className="text-2xl font-bold">
          <img src={ShoppingBag} alt="" />
        </Link>
      </div>
      <nav className="flex flex-col py-4">
        <Link to="/dashboard" className="py-2 px-6 hover:bg-teal-600">
          DASHBOARD
        </Link>
        <div>
          <div
            onClick={() => setIsShoppinessOpen(!isShoppinessOpen)}
            className="flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600"
          >
            <span>SHOPPINESSMART</span>
            {isShoppinessOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isShoppinessOpen && (
            <div className="flex flex-col pl-6">
              <Link
                to="/maast/submenu1"
                className="py-2 px-6 hover:bg-teal-600"
              >
                Edit Pages
              </Link>
              <Link
                to="/maast/submenu2"
                className="py-2 px-6 hover:bg-teal-600"
              >
                Contact Info
              </Link>
              <Link
                to="/maast/submenu2"
                className="py-2 px-6 hover:bg-teal-600"
              >
                Social media
              </Link>
              <Link
                to="/maast/submenu2"
                className="py-2 px-6 hover:bg-teal-600"
              >
                Blog
              </Link>
              <Link
                to="/admin/shoppiness/privacy-policy"
                className="py-2 px-6 hover:bg-teal-600"
              >
                Privacy polices
              </Link>
              <Link
                to="/admin/shoppiness/faq"
                className="py-2 px-6 hover:bg-teal-600"
              >
                FAQs
              </Link>
              <Link
                to="/maast/submenu2"
                className="py-2 px-6 hover:bg-teal-600"
              >
                Newsletters
              </Link>
            </div>
          )}
        </div>
        <div>
          <div
            onClick={() => setIsMaastOpen(!isMaastOpen)}
            className="flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600"
          >
            <span>MAAST</span>
            {isMaastOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isMaastOpen && (
            <div className="flex flex-col pl-6">
              <Link
                to="/maast/submenu1"
                className="py-2 px-6 hover:bg-teal-600"
              >
                Submenu 1
              </Link>
              <Link
                to="/maast/submenu2"
                className="py-2 px-6 hover:bg-teal-600"
              >
                Submenu 2
              </Link>
            </div>
          )}
        </div>
        <div>
          <div
            onClick={() => setIsNgoOpen(!isNgoOpen)}
            className="flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600"
          >
            <span>NGO/CAUSES</span>
            {isNgoOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isNgoOpen && (
            <div className="flex flex-col pl-6">
              <Link to="/ngo/submenu1" className="py-2 px-6 hover:bg-teal-600">
                Submenu 1
              </Link>
              <Link to="/ngo/submenu2" className="py-2 px-6 hover:bg-teal-600">
                Submenu 2
              </Link>
            </div>
          )}
        </div>
        <div>
          <div
            onClick={() => setIsProductOpen(!isProductOpen)}
            className="flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-teal-600"
          >
            <span>PRODUCT/SERVICES</span>
            {isProductOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isProductOpen && (
            <div className="flex flex-col pl-6">
              <Link
                to="/product/submenu1"
                className="py-2 px-6 hover:bg-teal-600"
              >
                Submenu 1
              </Link>
              <Link
                to="/product/submenu2"
                className="py-2 px-6 hover:bg-teal-600"
              >
                Submenu 2
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
