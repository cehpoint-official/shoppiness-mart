import { useEffect, useState } from "react";
import "./UserProfile.scss";
import { IoReload } from "react-icons/io5";
import CashbackGiveback from "./../Cashback&GiveBack/CashbackGiveback";
import { useDispatch } from "react-redux";
import ProfileInfo from "../ProfileInfo";
import ManageAddress from "../ManageAddress";
import Payment from "../Payment";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import Coupons from "../../Components/MyCoupons/Coupons";

const UserProfile = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState("coupons");
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userId } = useParams();

  const fetchDoc = async () => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        dispatch(userExist(data));
      } else {
        alert("No such document!");
        dispatch(userNotExist());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [userId]); // Added userId as dependency to refetch if it changes

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // On mobile, might want to close the dropdown after selection
    if (window.innerWidth <= 768) {
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Loader component to avoid duplication
  const Loader = () => (
    <div className="loader">
      <IoReload className="spin" />
    </div>
  );

  // User info section
  const UserInfo = () => (
    <>
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
    </>
  );

  return (
    <div className="userProfile">
      <div className="left">
        <div className="top">
          {isLoading ? <Loader /> : <UserInfo />}
        </div>
        <div className="bottom">
          <div 
            className="item" 
            onClick={() => handlePageChange("coupons")}
          >
            My Coupons
          </div>
          <div 
            className="item" 
            onClick={() => handlePageChange("cashback")}
          >
            Cashback & Giveback
          </div>
          <div className="item" onClick={toggleDropdown}>
            Account Settings
            {/* You could add an arrow icon here that rotates based on dropdown state */}
          </div>
          
          <div
            className={`transition-all duration-300 ease-in-out ${
              isDropdownOpen ? "max-h-40" : "max-h-0"
            } overflow-hidden`}
          >
            <div
              className="item pl-8"
              onClick={() => handlePageChange("profileinfo")}
            >
              Profile Info
            </div>
            <div
              className="item mt-4 pl-8"
              onClick={() => handlePageChange("manageaddress")}
            >
              Manage Address
            </div>
            <div
              className="item mt-4 pl-8"
              onClick={() => handlePageChange("payment")}
            >
              Payment Method
            </div>
          </div>
        </div>
      </div>

      <div className="right">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {currentPage === "coupons" && <Coupons />}
            {currentPage === "cashback" && <CashbackGiveback userData={userData} />}
            {currentPage === "profileinfo" && <ProfileInfo userData={userData} />}
            {currentPage === "manageaddress" && <ManageAddress userData={userData} />}
            {currentPage === "payment" && <Payment userData={userData} />}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;