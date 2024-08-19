import React from "react";
import "./DashboardHeader.scss";
import { CiSearch } from "react-icons/ci";
import { IoIosNotifications } from "react-icons/io";
const DashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <div className="title">
        <h1>Welcome Basit👋</h1>
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
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
