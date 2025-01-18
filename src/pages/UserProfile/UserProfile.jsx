import { useState } from "react";
import "./UserProfile.scss";
import { IoCopyOutline } from "react-icons/io5";
import CashbackGiveback from "./../Cashback&GiveBack/CashbackGiveback";
import { useSelector } from "react-redux";
import ProfileInfo from "../ProfileInfo";

const UserProfile = () => {
  const [currentPage, setCurrentPage] = useState("coupons");
  const userData = useSelector((state) => state.userReducer.user);
  console.log("user profile", userData);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="userProfile">
      <div className="left">
        <div className="top">
          <div className="profile">
            <img
              src={
                userData.profilePic ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
              }
              alt="user profile"
            />
          </div>
          <div className="details">
            <p>Hello,</p>
            <p>
              {userData.fname} {userData.lname}
            </p>
          </div>
        </div>
        <div className="bottom">
          <div className="item" onClick={() => handlePageChange("coupons")}>
            My Coupons
          </div>
          <div className="item" onClick={() => handlePageChange("cashback")}>
            Cashback & Giveback
          </div>
          <div className="item" onClick={() => handlePageChange("settings")}>
            Account Settings
          </div>
          <div className="item" onClick={() => handlePageChange("profileinfo")}>
            Profile Info
          </div>
          <div className="item" onClick={() => handlePageChange("settings")}>
            Manage Address
          </div>
          <div className="item" onClick={() => handlePageChange("settings")}>
            Payment Method
          </div>
        </div>
      </div>

      <div className="right">
        {currentPage === "coupons" && (
          <div className="availableCoupons">
            <h1>Available Coupons</h1>
            <div className="coupon">
              <div className="top">
                <p className="title">Pizza Hut</p>
                <p>15 Jun, 2024</p>
              </div>
              <div className="bottom">
                <p className="desc">
                  Enjoy 25% Off In-Store Purchases + 1% Cashback at Shoppiness
                  Mart!
                </p>
                <div className="code">
                  Coupon code - #878583
                  <IoCopyOutline />
                </div>
              </div>
            </div>

            <div className="coupon">
              <div className="top">
                <p className="title">Pizza Hut</p>
                <p>15 Jun, 2024</p>
              </div>
              <div className="bottom">
                <p className="desc">
                  Enjoy 25% Off In-Store Purchases + 1% Cashback at Shoppiness
                  Mart!
                </p>
                <div className="code">
                  Coupon code - #878583
                  <IoCopyOutline />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === "cashback" && <CashbackGiveback />}

        {currentPage === "settings" && (
          <div className="settings">
            <h1>Account Settings</h1>
            <p>Your account settings details go here...</p>
          </div>
        )}
        {currentPage === "profileinfo" && <ProfileInfo userData={userData} />}
      </div>
    </div>
  );
};

export default UserProfile;
