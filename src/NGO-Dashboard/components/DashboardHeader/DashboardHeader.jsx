import { useState, useEffect, useCallback } from "react";
import "./DashboardHeader.scss";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { CiSearch } from "react-icons/ci";
import { IoIosNotifications, IoIosCamera } from "react-icons/io";
import { db, storage } from "../../../../firebase";
import { ImSpinner8 } from "react-icons/im";
import {
  ngoUserExist,
  setLoading,
} from "../../../redux/reducer/ngoUserReducer";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const DashboardHeader = () => {
  const { user, loading } = useSelector((state) => state.ngoUserReducer);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const image = user?.logoUrl;

  const fetchNotifications = useCallback(async () => {
    try {
      const q = query(
        collection(db, "ngoNotifications"),
        where("ngoId", "==", id)
      );
      const querySnapshot = await getDocs(q);
      const notificationData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort notifications by createdAt string in descending order
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
  }, [id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "ngoNotifications", notificationId);
      await updateDoc(notificationRef, { read: true });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dispatch(setLoading(true));

    try {
      const metadata = { contentType: "image/jpeg" };
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading image:", error);
          dispatch(setLoading(false));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const updatedData = { ...user, logoUrl: downloadURL };
            await handleSave(updatedData);
            dispatch(ngoUserExist(updatedData));
          } catch (error) {
            console.error("Error getting download URL:", error);
          } finally {
            dispatch(setLoading(false));
          }
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      dispatch(setLoading(false));
    }
  };

  const handleSave = async (updatedData) => {
    try {
      await setDoc(doc(db, "causeDetails", id), updatedData, { merge: true });
      dispatch(ngoUserExist(updatedData));
      console.log("User data updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Helper function to format ISO string date
  const formatDate = (isoString) => {
    if (!isoString) return "Unknown time";
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="dashboard-header">
      <div className="title">
        <h1>Welcome {user?.firstName}🤚</h1>
      </div>
      <div className="profile-sec">
        {/* <div className="search-bar">
          <CiSearch />
          <input type="text" placeholder="Search Here" />
        </div> */}
        <div className="notifications relative">
          <div
            className="cursor-pointer relative"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <IoIosNotifications className="w-6 h-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>

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
        <div className="relative">
          <div className="flex items-center gap-4">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer"
            >
              {loading ? (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200">
                  <ImSpinner8 className="animate-spin" />
                </div>
              ) : (
                <img
                  src={
                    image ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
                  }
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg">
              <div className="p-6 flex flex-col items-center">
                <div className="relative">
                  {loading ? (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-200">
                      <ImSpinner8 className="animate-spin" />
                    </div>
                  ) : (
                    <>
                      <img
                        src={
                          image ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
                        }
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <label
                        htmlFor="image-upload"
                        className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50"
                      >
                        <IoIosCamera className="w-4 h-4 text-gray-600" />
                      </label>
                    </>
                  )}
                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
                  <p className="text-gray-600 text-sm">{user?.mobileNumber}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;