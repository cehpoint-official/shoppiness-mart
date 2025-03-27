import React, { useState, useEffect } from "react";
import logo from "../../assets/RegisterBusiness/logo.png";
import { CiSearch, CiLocationOn } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { IoNotifications, IoMenu, IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { userNotExist } from "../../redux/reducer/userReducer";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../../../firebase";

const UserDashboardNav = ({ profilePic, userId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userId) {
          console.warn("No userId provided");
          return;
        }

        // Step 1: Fetch the user document using userId
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          console.warn("No user found with the provided userId");
          return;
        }

        const userEmail = userDoc.data().email;
        console.log("Fetched user email:", userEmail);

        if (!userEmail) {
          console.warn("User document does not contain an email field");
          return;
        }

        // Step 2: Query userNotifications collection where userId matches the email
        const q = query(
          collection(db, "userNotifications"),
          where("userId", "==", userEmail)
        );

        // Step 3: Execute the query and map results
        const querySnapshot = await getDocs(q);
        const fetchedNotifications = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched notifications:", fetchedNotifications);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      // Reference to the specific notification document
      const notificationRef = doc(db, "userNotifications", notificationId);

      // Update the read status
      await updateDoc(notificationRef, {
        read: true
      });

      // Update local state to reflect read status
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Toggle notification popup
  const toggleNotificationPopup = () => {
    setShowNotificationPopup(prev => !prev);
  };

  return (
    <div className="w-full">
      {/* Upper Nav */}
      <div className="flex justify-between items-center px-[100px] py-0">
        <Link to="/">
          <img src={logo} alt="err" className="w-[210px] h-[80px]" />
        </Link>
        <div className="hidden lg:flex items-center border border-gray-500 h-[45px] px-[50px] rounded-lg">
          <div className="flex items-center gap-2">
            <CiLocationOn className="text-2xl" />
            <input type="text" placeholder="Select Location" className="outline-none" />
          </div>
          <hr className="border border-gray-500 h-[30px] mx-2" />
          <div className="flex items-center gap-2">
            <CiSearch className="text-xl" />
            <input type="text" placeholder="Search name of Store, Brand, Product" className="outline-none w-[270px]" />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative">
            <IoNotifications
              className="text-2xl cursor-pointer text-blue-600"
              onClick={toggleNotificationPopup}
            />
            {notifications.some(n => !n.read) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              dispatch(userNotExist());
              navigate("/login/user");
            }}
            className="text-blue-600 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Notification Popup */}
      {showNotificationPopup && (
        <div className="absolute right-[100px] top-[130px] w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b ${!notification.read ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {notification.timestamp && new Date(notification.timestamp.toDate()).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lower Nav */}
      <div className="bg-[#047e72] h-[100px] px-[100px] flex items-center gap-[50px] lg:justify-between">
        <div className="hidden lg:flex items-center justify-between w-[85%]">
          <Link to={`/user-dashboard/${userId}/dashboard`} className="text-white text-lg font-poppins">Dashboard</Link>
          <Link to={`/user-dashboard/${userId}/offline-shop`} className="text-white text-lg font-poppins">Offline Shops</Link>
          <Link to={`/user-dashboard/${userId}/online-shop`} className="text-white text-lg font-poppins">Online Shops</Link>
          <Link to={`/user-dashboard/${userId}/howitworks`} className="text-white text-lg font-poppins">How it works</Link>
          <Link to={`/user-dashboard/${userId}/cashback-charity`} className="text-white text-lg font-poppins">For charities</Link>
          <Link to={`/user-dashboard/${userId}/supportmaast`} className="text-white text-lg font-poppins">Support Maast</Link>
          <Link to={`/user-dashboard/${userId}/profile`} className="text-white text-lg font-poppins">My Profile</Link>
        </div>
        <div className="flex items-center justify-between w-full lg:w-auto gap-5">
          <IoMenu className="text-3xl lg:hidden text-white cursor-pointer" onClick={() => setMenuOpen(true)} />
          <div className="flex items-center gap-5">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
              <Link to={`/user-dashboard/${userId}/profile`}>
                <img
                  src={profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"}
                  alt="profilePic"
                  className="w-full h-full object-cover cursor-pointer"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-[250px] bg-white p-5 shadow-lg z-50 transition-transform transform translate-x-0">
            <IoClose className="text-3xl cursor-pointer mb-5" onClick={() => setMenuOpen(false)} />
            <div className="flex flex-col gap-4">
              <Link to={`/user-dashboard/${userId}/dashboard`} className="text-gray-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to={`/user-dashboard/${userId}/offline-shop`} className="text-gray-700" onClick={() => setMenuOpen(false)}>Offline Shops</Link>
              <Link to={`/user-dashboard/${userId}/online-shop`} className="text-gray-700" onClick={() => setMenuOpen(false)}>Online Shops</Link>
              <Link to={`/user-dashboard/${userId}/howitworks`} className="text-gray-700" onClick={() => setMenuOpen(false)}>How it works</Link>
              <Link to={`/user-dashboard/${userId}/cashback-charity`} className="text-gray-700" onClick={() => setMenuOpen(false)}>For charities</Link>
              <Link to={`/user-dashboard/${userId}/supportmaast`} className="text-gray-700" onClick={() => setMenuOpen(false)}>Support Maast</Link>
              <Link to={`/user-dashboard/${userId}/profile`} className="text-gray-700" onClick={() => setMenuOpen(false)}>My Profile</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardNav;