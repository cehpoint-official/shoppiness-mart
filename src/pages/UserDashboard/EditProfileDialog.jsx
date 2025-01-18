import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

const EditProfileDialog = ({ userData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: userData.uid,
    fname: userData.fname,
    lname: userData.lname,
    email: userData.email,
    phone: userData.phone,
    profilePic: userData.profilePic || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const metadata = {
        contentType: "image/jpeg",
      };
      const storageRef = ref(storage, "images/" + file.name);
      await uploadBytesResumable(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(storageRef);

      setFormData((prev) => ({ ...prev, profilePic: downloadURL }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            {isLoading ? (
              <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center">
                <FaSpinner className="animate-spin text-blue-600 text-2xl" />{" "}
                {/* Spinner */}
              </div>
            ) : formData.profilePic ? (
              <img
                src={formData.profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-500">
                Add Profile Pic
              </div>
            )}
            <input
              type="file"
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isLoading} // Disable input while loading
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileDialog;
