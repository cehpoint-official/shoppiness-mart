import "./UserDashboardNav.scss";
import logo from "../../assets/RegisterBusiness/logo.png";
import { CiSearch } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";

const UserDashboardNav = ({ profilePic, userId }) => {
  return (
    <div className="UserDashboardNav">
      <div className="upperNav">
        <Link to="/">
          {" "}
          <img src={logo} alt="err" />
        </Link>
        <div className="inputSection">
          <div className="left">
            <CiLocationOn />
            <input type="text" placeholder="Select Location" />
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
          <Link to={`/user-dashboard/${userId}`}>Dashboard</Link>
          <Link to={`/user-dashboard/${userId}/offline-shop`}>
            Offline Shops
          </Link>
          <Link to={`/user-dashboard/${userId}/online-shop`}>Online Shops</Link>
          <Link to={`/user-dashboard/${userId}/howitworks`}>How it works</Link>
          <Link to={`/user-dashboard/${userId}/cashback-charity`}>
            For charities
          </Link>
          <Link to={`/user-dashboard/${userId}/supportmaast`}>
            Support Maast
          </Link>
          <Link to={`/user-dashboard/${userId}/profile`}>My Profile</Link>
        </div>

        <div className="profile">
          <IoNotifications />
          <div className="profilePic">
            <img
              src={
                profilePic ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
              }
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardNav;
