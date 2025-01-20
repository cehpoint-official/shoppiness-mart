import "./DashboardHeader.scss";
import { CiSearch } from "react-icons/ci";
import { IoIosNotifications } from "react-icons/io";
const DashboardHeader = ({ userData }) => {


  return (
    <div className="dashboard-header">
      <div className="title">
        <h1>Welcome {userData.firstName}🤚</h1>
      </div>
      <div className="profile-sec">
        <div className="search-bar">
          <CiSearch />
          <input type="text" placeholder="Search  Here" />
        </div>
        <div className="notifications">
          <IoIosNotifications />
        </div>
        <div className="profile">
          <img
            src={
              userData.logoUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
            }
            alt="user profile"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
