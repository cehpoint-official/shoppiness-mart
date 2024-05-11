import ShoppingBag from "../../assets/ShoppingBag.png";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import "./Navbar.scss";
import { useEffect, useState } from "react";
const Navbar = () => {
  const [active, setActive] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setActive(false);
  }, [location]);
  return (
    <div className="navbar">
      <div className="top">
        <img src={ShoppingBag} className="h-11 " alt="Loading..." />
        <div className="links">
          <Link to="/login" className="login">
            <i className="bi bi-arrow-right-circle-fill text-white "></i>
            Login
          </Link>
          <Link to="/signup" className="register">
            <i className="bi bi-pencil-fill text-[#049D8E]  text-lg"></i>
            Signup
          </Link>
        </div>
        <div className="hamburgerMenu">
          <GiHamburgerMenu onClick={() => setActive((prev) => !prev)} />
        </div>
      </div>
      <div className="bottom">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/cashback">Cashback/deals</Link>
        <Link to="/howitworks">How it works</Link>
        <Link to="/support">Support a Cause/NGO</Link>
        <Link to="/register-cause">Register a Cause/NGO</Link>
        <Link to="/register-business">Register a business/Service</Link>
        <Link to="/supportmaast">Support Maast</Link>
      </div>

      {active && (
        <div className="menu">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/cashback">Cashback/deals</Link>
          <Link to="/howitworks">How it works</Link>
          <Link to="/support">Support a Cause/NGO</Link>
          <Link to="/register-cause">Register a Cause/NGO</Link>
          <Link to="/register-business">Register a business/Service</Link>
          <Link to="/supportmaast">Support Maast</Link>
          <Link to="/login" className="login">
            <i className="bi bi-arrow-right-circle-fill text-white "></i>
            Login
          </Link>
          <Link to="/signup" className="register">
            <i className="bi bi-pencil-fill text-[#049D8E]  text-lg"></i>
            Signup
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
