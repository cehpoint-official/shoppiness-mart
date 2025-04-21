import { useState, useEffect, useCallback } from "react";
import { FiBell } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useDispatch } from "react-redux";
import { userNotExist } from "../../../redux/reducer/userReducer";
import { useNavigate } from "react-router-dom";
import { persistor } from "../../../redux/store";

const Navbar = ({ userId }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationOpen && !event.target.closest(".notification-container")) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Fetch profile picture from user document
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        if (!userId) return;
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfilePic(userSnap.data().profilePic);
          setName(userSnap.data().fname.split(" ")[0]);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePic();
  }, [userId]);

  // Fetch notifications from adminNotifications collection
  const fetchNotifications = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "adminNotifications"));
      const notificationData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort notifications by createdAt in descending order (newest first)
      notificationData.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA; // Descending order
      });

      // Separate unread and read notifications
      const unreadNotifications = notificationData.filter(
        (notif) => !notif.read
      );
      const readNotifications = notificationData.filter((notif) => notif.read);
      setUnreadCount(unreadNotifications.length);

      // Logic: Show up to 4 notifications, prioritizing unread
      let displayedNotifications = [];
      if (unreadNotifications.length >= 4) {
        displayedNotifications = unreadNotifications.slice(0, 4);
      } else {
        displayedNotifications = [...unreadNotifications];
        const remainingSlots = 4 - unreadNotifications.length;
        if (remainingSlots > 0 && readNotifications.length > 0) {
          displayedNotifications = [
            ...displayedNotifications,
            ...readNotifications.slice(0, remainingSlots),
          ];
        }
      }

      setNotifications(displayedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "adminNotifications", notificationId);
      await updateDoc(notificationRef, { read: true });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Format date helper function
  const formatDate = (isoString) => {
    if (!isoString) return "Unknown time";
    return new Date(isoString).toLocaleString();
  };

  // Toggle notification
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Logout Dialog Component
  const LogoutDialog = () => {
    if (!showLogoutDialog) return null;

    const handleLogout = async () => {
      try {
        // Clear user from Redux
        dispatch(userNotExist());
        // Clear localStorage
        localStorage.removeItem("userRole");
        // Purge persistor
        await persistor.purge().then(() => {
          // Navigate to login page
          navigate("/login/user");
        });
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:w-80 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#F95151] flex items-center justify-center mb-3 sm:mb-4">
              <IoLogOutOutline className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-center">
              Are you sure! You want to log out
            </h3>
            <div className="flex gap-3 sm:gap-4 w-full justify-center">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap md:flex-nowrap md:items-center justify-between h-auto min-h-16 py-2">
            {/* Left side - Welcome message */}
            <div className="flex items-center space-x-2 order-1 w-full md:w-auto md:mr-auto mb-2 md:mb-0">
              <span className="text-sm sm:text-base lg:text-lg font-bold truncate">
                Welcome {name} 👋
              </span>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center justify-between md:justify-end space-x-3 w-full md:w-auto order-3 md:order-2">
              {/* Notification Button */}
              <div className="relative notification-container">
                <button
                  className="p-1 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
                  onClick={toggleNotification}
                >
                  <FiBell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Panel */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-screen xs:w-72 sm:w-80 md:w-96 bg-white rounded-lg shadow-xl border border-green-50 z-50 max-h-[80vh] overflow-y-auto"
                    style={{ maxWidth: "calc(100vw - 20px)" }}>
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-green-800">
                          Notifications
                        </h3>
                        <span className="text-xs text-green-600 font-medium">
                          {unreadCount} New
                        </span>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="text-center py-4 bg-green-50 rounded-lg">
                          <p className="text-green-600 font-medium text-sm">
                            No new notifications
                          </p>
                          <p className="text-xs text-green-500 mt-1">
                            You're all caught up!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`transition-all duration-300 ease-in-out ${notif.read ? "" : ""
                                } border-y py-2`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-grow">
                                  <p
                                    className={`text-xs ${notif.read
                                      ? "text-gray-700"
                                      : "text-green-800 font-semibold"
                                      }`}
                                  >
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(notif.createdAt)}
                                  </p>
                                </div>
                                {!notif.read && (
                                  <button
                                    onClick={() => handleMarkAsRead(notif.id)}
                                    className="bg-green-500 text-white text-xs rounded p-1 hover:bg-green-600 transition-colors duration-200 whitespace-nowrap"
                                  >
                                    Mark Read
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="text-blue-600 text-base sm:text-base font-medium hover:text-blue-800 transition-colors"
              >
                Logout
              </button>

              {/* Profile Picture */}
              <img
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                src={profilePic}
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Render Logout Dialog */}
      <LogoutDialog />
    </>
  );
};

export default Navbar;