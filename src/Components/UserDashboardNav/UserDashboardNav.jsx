import "./UserDashboardNav.scss";
import logo from "../../assets/RegisterBusiness/logo.png";
import { CiSearch } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";

const UserDashboardNav = () => {
  return (
    <div className="UserDashboardNav">
      <div className="upperNav">
       <Link to="/"> <img
          src={logo}
          alt="err"
        /></Link>
        <div className="inputSection">
          <div className="left">
            <CiLocationOn />
            <input
              type="text"
              placeholder="Select Location"
            />
          </div>
          <hr />
          <div className="right">
            <CiSearch />
            <input
              type="text"
              placeholder="Search name of Store, Brand, Product"
            />
          </div>
        </div>

        <button>Logout</button>
      </div>

      <div className="lowerNav">
        <div className="links">
          <Link to="">Dashboard</Link>
          <Link to="/offline-shop">Offline Shops</Link>
          <Link to="/online-shop">Online Shops</Link>
          <Link to="/howitworks">How it works</Link>
          <Link to="/cashback-charity">For charities</Link>
          <Link to="/support">Support Maast</Link>
          <Link to="">My Profile</Link>
        </div>

        <div className="profile">
          <IoNotifications />
          <div className="profilePic">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardNav;
