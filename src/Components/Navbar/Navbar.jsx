import ShoppingBag from "../../assets/ShoppingBag.png";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai"; // Importing cross icon
import { useEffect, useState } from "react";
import "./Navbar.scss";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setActive(false);
  }, [location]);

  const getLinkClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const toggleLoginDropdown = () => {
    setShowLoginDropdown((prev) => !prev);
  };

  return (
    <div className="navbar">
      <div className="top">
        <Link to="/">
          <img src={ShoppingBag} className="h-11" alt="Loading..." />
        </Link>
        <div className="links">
          <div className="relative">
            <button
              onClick={toggleLoginDropdown}
              className="border-2 border-white px-5 py-2 rounded-[6px] flex items-center justify-center gap-2.5 text-white font-medium text-lg"
            >
              <i className="bi bi-arrow-right-circle-fill text-white"></i>
              Login
            </button>

            {showLoginDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <Link
                  to="/login/cause"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login as Cause/NGO
                </Link>
                <Link
                  to="/login/business"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login as Business/Service
                </Link>
                <Link
                  to="/login/user"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login as User
                </Link>
              </div>
            )}
          </div>
          <Link to="/signup" className="register">
            <i className="bi bi-pencil-fill text-[#049D8E] text-lg"></i>
            Signup
          </Link>
        </div>
        <div className="hamburgerMenu">
          {active ? (
            <AiOutlineClose onClick={() => setActive((prev) => !prev)} />
          ) : (
            <GiHamburgerMenu onClick={() => setActive((prev) => !prev)} />
          )}
        </div>
      </div>
      <div className="bottom">
        <Link to="/" className={getLinkClass("/")}>
          Home
        </Link>
        <Link to="/offline-shop" className={getLinkClass("/offline-shop")}>
          Offline Shop
        </Link>
        <Link to="/online-shop" className={getLinkClass("/online-shop")}>
          Online Shop
        </Link>
        <Link to="/howitworks" className={getLinkClass("/howitworks")}>
          How it works
        </Link>
        <Link to="/support" className={getLinkClass("/support")}>
          Support a Cause/NGO
        </Link>
        <Link to="/register-cause" className={getLinkClass("/register-cause")}>
          Register a Cause/NGO
        </Link>
        <Link
          to="/register-business"
          className={getLinkClass("/register-business")}
        >
          Register a business/Service
        </Link>
        <Link to="/supportmaast" className={getLinkClass("/supportmaast")}>
          Support Maast
        </Link>
      </div>

      {active && (
        <div className="menu">
          <Link to="/">Home</Link>
          <Link to="/offline-shop">Offline Shop</Link>
          <Link to="/online-shop">Online Shop</Link>
          <Link to="/cashback-deals">Cashback/deals</Link>
          <Link to="/howitworks">How it works</Link>
          <Link to="/support">Support a Cause/NGO</Link>
          <Link to="/register-cause">Register a Cause/NGO</Link>
          <Link to="/register-business">Register a business/Service</Link>
          <Link to="/supportmaast">Support Maast</Link>
          <div className="relative">
            <button onClick={toggleLoginDropdown} className="login w-full">
              <i className="bi bi-arrow-right-circle-fill text-white"></i>
              Login
            </button>
            {showLoginDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <Link
                  to="/login/cause"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login as Cause/NGO
                </Link>
                <Link
                  to="/login/business"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login as Business/Service
                </Link>
                <Link
                  to="/login/user"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login as User
                </Link>
              </div>
            )}
          </div>
          <Link to="/signup" className="register">
            <i className="bi bi-pencil-fill text-[#049D8E] text-lg"></i>
            Signup
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
