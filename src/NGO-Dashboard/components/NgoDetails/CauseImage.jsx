import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { db, storage } from "../../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  ngoUserExist,
} from "../../../redux/reducer/ngoUserReducer"; // Import setLoading
import { FaSpinner } from "react-icons/fa"; // Import the spinner icon for rotating dots
import { doc, setDoc } from "firebase/firestore";

const CauseImage = () => {
  const { user } = useSelector((state) => state.ngoUserReducer);
  const { id } = useParams();
  const dispatch = useDispatch();

  const [logoFile, setLogoFile] = useState(null); // State for logo file
  const [bannerFile, setBannerFile] = useState(null); // State for banner file
  const [isLoading, setIsLoading] = useState(false); // Loading state for Save Images button
  const [logoPreview, setLogoPreview] = useState(null); // Temporary URL for logo preview
  const [bannerPreview, setBannerPreview] = useState(null); // Temporary URL for banner preview

  // Handle logo file change
  const handleFileChangeLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoFile(file); // Set the logo file
    setLogoPreview(URL.createObjectURL(file)); // Create a temporary URL for preview
  };

  // Handle banner file change
  const handleFileChangeBanner = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerFile(file); // Set the banner file
    setBannerPreview(URL.createObjectURL(file)); // Create a temporary URL for preview
  };

  // Upload file to Firebase Storage and return the download URL
  const uploadFile = async (file) => {
    try {
      const metadata = {
        contentType: file.type, // Use the file's MIME type
      };
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      // Wait for the upload to complete
      await uploadTask;

      // Get the download URL
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  };

  // Handle Save Images button click
  const handleSaveImages = async () => {
    if (!logoFile && !bannerFile) return; // No files to upload

    setIsLoading(true); // Start loading

    try {
      let updatedData = { ...user };

      // Upload logo if a new logo file is selected
      if (logoFile) {
        const logoUrl = await uploadFile(logoFile);
        updatedData = { ...updatedData, logoUrl };
        setLogoPreview(null); // Clear the temporary preview after upload
      }

      // Upload banner if a new banner file is selected
      if (bannerFile) {
        const bannerUrl = await uploadFile(bannerFile);
        updatedData = { ...updatedData, bannerUrl };
        setBannerPreview(null); // Clear the temporary preview after upload
      }

      // Update Firestore with the new data
      await setDoc(doc(db, "causeDetails", id), updatedData, {
        merge: true,
      });

      // Dispatch the updated user data to Redux
      dispatch(ngoUserExist(updatedData));

      console.log("Images updated successfully!");
    } catch (error) {
      console.error("Error updating images:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="space-y-6 max-w-lg mb-4">
      {/* Logo Upload Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Upload Cause/NGO Logo:
        </h3>
        <div className="border-2 border-dashed border-black p-8 text-center">
          <div className="relative">
            {(logoPreview || user?.logoUrl) && (
              <img
                src={logoPreview || user.logoUrl}
                alt="Logo"
                className="w-32 h-32 object-cover mx-auto mb-4"
              />
            )}
            {isLoading && logoFile && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <FaSpinner className="animate-spin text-white text-2xl" />
              </div>
            )}
          </div>
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChangeLogo}
          />
          <label
            htmlFor="logo-upload"
            className="mt-2 text-blue-600 font-medium text-sm hover:underline cursor-pointer"
          >
            {user?.logoUrl ? "Change Logo" : "Browse"}
          </label>
          <p className="text-xs text-gray-400 mt-1">
            JPEG, PNG, or GIF - 5MB file limit
          </p>
        </div>
      </div>

      {/* Banner Upload Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Upload Cause/NGO Banner:
        </h3>
        <div className="border-2 border-dashed border-black p-8 text-center">
          <div className="relative">
            {(bannerPreview || user?.bannerUrl) && (
              <img
                src={bannerPreview || user.bannerUrl}
                alt="Banner"
                className="w-full h-48 object-cover mx-auto mb-4"
              />
            )}
            {isLoading && bannerFile && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <FaSpinner className="animate-spin text-white text-2xl" />
              </div>
            )}
          </div>
          <input
            type="file"
            id="banner-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChangeBanner}
          />
          <label
            htmlFor="banner-upload"
            className="mt-2 text-blue-600 font-medium text-sm hover:underline cursor-pointer"
          >
            {user?.bannerUrl ? "Change Banner" : "Browse"}
          </label>
          <p className="text-xs text-gray-400 mt-1">
            JPEG, PNG, or GIF - 5MB file limit
          </p>
        </div>
      </div>

      {/* Save Images Button */}
      <button
        className="w-full bg-[#FFB939] py-2 px-4 hover:bg-[#f5c161] flex items-center justify-center"
        onClick={handleSaveImages}
        disabled={isLoading || (!logoFile && !bannerFile)} // Disable if no files are selected or loading
      >
        {isLoading ? (
          <FaSpinner className="animate-spin mr-2" /> // Show spinner when loading
        ) : null}
        {isLoading ? "Saving..." : "Save Images"}
      </button>
    </div>
  );
};

export default CauseImage;
