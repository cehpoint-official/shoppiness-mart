import ShoppingBag from "../../assets/ShoppingBag.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";
import "./Navbar.scss";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get all possible user types from Redux
  const { user } = useSelector((state) => state.userReducer);
  const { user: ngoUser } = useSelector((state) => state.ngoUserReducer);
  const { user: businessUser } = useSelector(
    (state) => state.businessUserReducer
  );

  // Check if any user is logged in
  const isLoggedIn = user || ngoUser || businessUser;

  // Determine if current user is admin
  const isAdmin =
    user?.role === "admin" ||
    ngoUser?.role === "admin" ||
    businessUser?.role === "admin";

  useEffect(() => {
    setActive(false);
    // Scroll to top when location changes
    window.scrollTo(0, 0);
  }, [location]);

  const getLinkClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const toggleLoginDropdown = () => {
    setShowLoginDropdown((prev) => !prev);
  };

  // Handle dashboard navigation based on user type
  const handleDashboardNavigation = () => {
    if (isAdmin) {
      navigate(`/admin/${user.id}/shoppiness/dashboard`);
    } else if (user) {
      navigate(`/user-dashboard/${user.id}/dashboard`);
    } else if (ngoUser) {
      navigate(`/ngo-dashboard/${ngoUser.uid}/dashboard`);
    } else if (businessUser) {
      navigate(`/services-dashboard/${businessUser.id}/dashboard`);
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="navbar">
      <div className="top">
        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
          <img src={ShoppingBag} className="h-11" alt="Loading..." />
        </Link>
        <div className="links">
          {isLoggedIn ? (
            // Show dashboard button if any user is logged in
            <button
              onClick={handleDashboardNavigation}
              className="border-2 border-white px-5 py-2 rounded-[6px] flex items-center justify-center gap-2.5 text-white font-medium text-lg"
            >
              <i className="bi bi-speedometer2 text-white"></i>
              Go to Dashboard
            </button>
          ) : (
            // Show login and signup buttons if no user is logged in
            <>
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
                      onClick={() => window.scrollTo(0, 0)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Login as Cause/NGO
                    </Link>
                    <Link
                      to="/login/business"
                      onClick={() => window.scrollTo(0, 0)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Login as Business/Service
                    </Link>
                    <Link
                      to="/login/user"
                      onClick={() => window.scrollTo(0, 0)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Login as User
                    </Link>
                  </div>
                )}
              </div>
              <Link
                to="/signup"
                onClick={() => window.scrollTo(0, 0)}
                className="register"
              >
                <i className="bi bi-pencil-fill text-[#049D8E] text-lg"></i>
                Signup
              </Link>
            </>
          )}
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
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className={getLinkClass("/")}
        >
          Home
        </Link>
        <Link
          to="/offline-shop"
          onClick={() => window.scrollTo(0, 0)}
          className={getLinkClass("/offline-shop")}
        >
          Offline Shop
        </Link>
        <Link
          to="/online-shop"
          onClick={() => window.scrollTo(0, 0)}
          className={getLinkClass("/online-shop")}
        >
          Online Shop
        </Link>
        <Link
          to="/howitworks"
          onClick={() => window.scrollTo(0, 0)}
          className={getLinkClass("/howitworks")}
        >
          How it works
        </Link>
        <Link
          to="/support"
          onClick={() => window.scrollTo(0, 0)}
          className={getLinkClass("/support")}
        >
          Support a Cause/NGO
        </Link>
        <Link
          to="/register-cause"
          onClick={() => window.scrollTo(0, 0)}
          className={getLinkClass("/register-cause")}
        >
          Register a Cause/NGO
        </Link>
        <Link
          to="/register-business"
          onClick={() => window.scrollTo(0, 0)}
          className={getLinkClass("/register-business")}
        >
          Register a business/Service
        </Link>
        <Link
          to="/supportmaast"
          onClick={() => window.scrollTo(0, 0)}
          className={getLinkClass("/supportmaast")}
        >
          Support Maast
        </Link>
      </div>

      {active && (
        <div className="menu">
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            Home
          </Link>
          <Link to="/offline-shop" onClick={() => window.scrollTo(0, 0)}>
            Offline Shop
          </Link>
          <Link to="/online-shop" onClick={() => window.scrollTo(0, 0)}>
            Online Shop
          </Link>
          <Link to="/cashback-deals" onClick={() => window.scrollTo(0, 0)}>
            Cashback/deals
          </Link>
          <Link to="/howitworks" onClick={() => window.scrollTo(0, 0)}>
            How it works
          </Link>
          <Link to="/support" onClick={() => window.scrollTo(0, 0)}>
            Support a Cause/NGO
          </Link>
          <Link to="/register-cause" onClick={() => window.scrollTo(0, 0)}>
            Register a Cause/NGO
          </Link>
          <Link to="/register-business" onClick={() => window.scrollTo(0, 0)}>
            Register a business/Service
          </Link>
          <Link to="/supportmaast" onClick={() => window.scrollTo(0, 0)}>
            Support Maast
          </Link>

          {isLoggedIn ? (
            // Show dashboard button in mobile menu if any user is logged in
            <button
              onClick={handleDashboardNavigation}
              className="login w-full"
            >
              <i className="bi bi-speedometer2 text-white"></i>
              Go to Dashboard
            </button>
          ) : (
            // Show login and signup in mobile menu if no user is logged in
            <>
              <div className="relative">
                <button onClick={toggleLoginDropdown} className="login w-full">
                  <i className="bi bi-arrow-right-circle-fill text-white"></i>
                  Login
                </button>
                {showLoginDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                    <Link
                      to="/login/cause"
                      onClick={() => window.scrollTo(0, 0)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Login as Cause/NGO
                    </Link>
                    <Link
                      to="/login/business"
                      onClick={() => window.scrollTo(0, 0)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Login as Business/Service
                    </Link>
                    <Link
                      to="/login/user"
                      onClick={() => window.scrollTo(0, 0)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Login as User
                    </Link>
                  </div>
                )}
              </div>
              <Link
                to="/signup"
                onClick={() => window.scrollTo(0, 0)}
                className="register"
              >
                <i className="bi bi-pencil-fill text-[#049D8E] text-lg"></i>
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
