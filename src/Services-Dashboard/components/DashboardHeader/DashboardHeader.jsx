import { useState } from "react";
import "./DashboardHeader.scss";
import { CiSearch } from "react-icons/ci";
import { IoIosNotifications, IoIosCamera } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  businessUserExist,
  setLoading,
} from "../../../redux/reducer/businessUserReducer";
import { ImSpinner8 } from "react-icons/im";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../../../firebase";

const DashboardHeader = () => {
  const { user, loading } = useSelector((state) => state.businessUserReducer);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const image = user?.logoUrl;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dispatch(setLoading(true));

    try {
      const metadata = {
        contentType: "image/jpeg",
      };
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle upload progress here if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle actual errors here
          console.error("Error uploading image:", error);
          dispatch(setLoading(false));
        },
        async () => {
          try {
            // Upload completed successfully, now we can get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Update the user data in Firestore and Redux
            const updatedData = { ...user, logoUrl: downloadURL };
            await handleSave(updatedData);

            dispatch(businessUserExist(updatedData));
          } catch (error) {
            console.error("Error getting download URL:", error);
          } finally {
            dispatch(setLoading(false));
          }
        }
      );
    } catch (error) {
      console.error("Error initiating upload:", error);
      dispatch(setLoading(false));
    }
  };

  const handleSave = async (updatedData) => {
    try {
      await setDoc(doc(db, "businessDetails", id), updatedData, {
        merge: true,
      });
      console.log("User data updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error; // Re-throw to handle in the calling function
    }
  };

  return (
    <div className="dashboard-header">
      <div className="title">
        <h1>Welcome {user?.firstName}🤚</h1>
      </div>
      <div className="profile-sec">
        <div className="search-bar">
          <CiSearch />
          <input type="text" placeholder="Search Here" />
        </div>
        <div className="notifications">
          <IoIosNotifications />
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
            <div className="absolute z-50 right-0 mt-2 w-64 bg-white rounded-xl shadow-lg">
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
