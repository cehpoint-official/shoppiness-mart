import { useState, useEffect, useCallback } from "react";
import { FiBell } from "react-icons/fi";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useDispatch } from "react-redux";
import { userNotExist } from "../../../redux/reducer/userReducer";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userId }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch profile picture from user document
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        if (!userId) return;
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfilePic(userSnap.data().profilePic);
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

  // Handle logout functionality
  const handleLogout = () => {
    // Clear user from Redux
    dispatch(userNotExist());
    
    // Clear localStorage
    localStorage.removeItem("userRole");
    
    // Navigate to login page
    navigate("/login/user");
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold">Welcome Edmund 👋</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative mr-4">
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Search here"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="relative">
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <FiBell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-green-50 z-50 max-h-[500px] overflow-y-auto">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm md:text-xl font-bold text-green-800 flex items-center gap-2">
                        Notifications
                      </h3>
                      <span className="text-sm text-green-600 font-medium">
                        {unreadCount} New
                      </span>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 bg-green-50 rounded-xl">
                        <p className="text-green-600 font-medium">
                          No new notifications
                        </p>
                        <p className="text-xs text-green-500 mt-1">
                          You're all caught up!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                              notif.read ? "" : ""
                            } border-y-2 py-2`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-grow">
                                <p
                                  className={`text-xs ${
                                    notif.read
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
                                  className="bg-green-500 text-white text-xs rounded p-1 hover:bg-green-600 transition-colors duration-200"
                                >
                                  Mark as Read
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
            <button
              onClick={handleLogout}
              className="text-blue-600 font-medium hover:text-blue-800 transition-colors pr-4"
            >
              Logout
            </button>
            <img
              className="h-10 w-10 rounded-full"
              src={profilePic}
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;