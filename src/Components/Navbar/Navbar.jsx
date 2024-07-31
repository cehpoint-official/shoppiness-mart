import ShoppingBag from "../../assets/ShoppingBag.png";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai"; // Importing cross icon
import { useEffect, useState } from "react";
import "./Navbar.scss";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setActive(false);
  }, [location]);

  const getLinkClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="navbar">
      <div className="top">
        <Link to="/">
          <img src={ShoppingBag} className="h-11" alt="Loading..." />
        </Link>
        <div className="links">
          <Link to="/login" className="login">
            <i className="bi bi-arrow-right-circle-fill text-white"></i>
            Login
          </Link>
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
          <Link to="/login" className="login">
            <i className="bi bi-arrow-right-circle-fill text-white"></i>
            Login
          </Link>
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
