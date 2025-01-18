import React, { useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { userExist } from "../redux/reducer/userReducer";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDispatch } from "react-redux";

const ManageAddress = ({ userData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ ...userData });

  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use these coordinates to fetch the address details
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      // Update the Firestore document with the new address data
      await setDoc(doc(db, "users", userData.uid), formData, { merge: true });

      // Dispatch the updated user data to Redux
      dispatch(userExist(formData));

      console.log("Address data updated successfully!");
    } catch (error) {
      console.error("Error updating address data:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <div className="max-w-8xl mx-auto">
        <div className="flex gap-3 items-center mb-6">
          <h2 className="text-lg font-medium">Manage Address</h2>
          <button className="text-blue-600 font-medium hover:text-blue-700">
            Edit
          </button>
        </div>

        <button
          onClick={getCurrentLocation}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-6"
        >
          <BsPlusCircle size={20} />
          Use My Current Location
        </button>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">
                City/District/Town
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">PIN Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Full Address
              </label>
              <input
                type="text"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <BsPlusCircle className="animate-spin" /> Saving...
                </>
              ) : (
                "SAVE"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageAddress;
