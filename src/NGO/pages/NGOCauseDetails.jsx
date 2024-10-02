// src/NGO/pages/NGOCauseDetails.jsx

import React, { useState } from 'react';
import NGOsidebar from '../components/NGOsidebar';
import ProfilePic from '../../assets/googleicon.png'; // Replace with actual path
import NotificationIcon from '../../assets/googleicon.png'; // Replace with actual path

const NGOCauseDetails = () => {
  const [activeButton, setActiveButton] = useState("Cause Info");
  const [ngoLogo, setNgoLogo] = useState(null);
  const [ngoBanner, setNgoBanner] = useState(null);

  const handleLogoChange = (event) => {
    setNgoLogo(URL.createObjectURL(event.target.files[0]));
  };

  const handleBannerChange = (event) => {
    setNgoBanner(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <NGOsidebar />

      <div className="flex-1 p-6 bg-gray-100">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Welcome Jit</span>
          <div className="flex items-center space-x-4">
            <img src={ProfilePic} alt="Profile" className="w-10 h-10 rounded-full border border-gray-300" />
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search here" 
                className="p-2 pl-10 border rounded-lg bg-white text-gray-700 focus:outline-none focus:border-teal-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 4a7 7 0 0114 14 7 7 0 01-14-14zM10 11l2 2 2-2"
                />
              </svg>
            </div>
            <img src={NotificationIcon} alt="Notifications" className="w-6 h-6" />
          </div>
        </div>

        {/* Cause/NGO Details Header */}
        <div className="mb-4">
          <span className="text-2xl font-semibold text-blue-600">Cause/NGO Details</span>
        </div>

        {/* Buttons Section */}
        <div className="flex space-x-4 mb-4">
          {["Cause Info", "Cause Image", "Payment Info", "Transaction Summary", "Cause Page"].map((button) => (
            <button
              key={button}
              onClick={() => setActiveButton(button)}
              className={`py-2 px-4 rounded ${activeButton === button ? "underline" : "hover:bg-gray-200"}`}
            >
              {button}
            </button>
          ))}
        </div>

        {/* Conditional Content Rendering */}
        {activeButton === "Cause Info" && (
          <div className="bg-white p-6 shadow-lg rounded-lg space-y-4">
            {/* Cause Info Form */}
            <div>
              <label className="block mb-2">Category</label>
              <select className="border rounded-lg w-full p-2">
                <option value="">Please Select</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Sub Category</label>
              <select className="border rounded-lg w-full p-2">
                <option value="">Please Select</option>
                <option value="subcategory1">Subcategory 1</option>
                <option value="subcategory2">Subcategory 2</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">About your cause</label>
              <textarea className="border rounded-lg w-full p-2" rows="4" placeholder="Tell us about your cause..."></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Phone Number</label>
                <input type="text" className="border rounded-lg w-full p-2" placeholder="Enter phone number" />
              </div>
              <div>
                <label className="block mb-2">Postcode</label>
                <input type="text" className="border rounded-lg w-full p-2" placeholder="Enter postcode" />
              </div>
            </div>
          </div>
        )}

        {activeButton === "Cause Image" && (
          <div className="bg-white p-6 shadow-lg rounded-lg space-y-4">
            {/* NGO Logo Upload */}
            <div>
              <label className="block mb-2">NGO Logo</label>
              <input type="file" onChange={handleLogoChange} className="border rounded-lg w-full p-2" />
              {ngoLogo && <img src={ngoLogo} alt="Uploaded Logo" className="mt-2 w-32 h-32 object-cover" />}
            </div>

            {/* NGO Banner Upload */}
            <div>
              <label className="block mb-2">NGO Banner</label>
              <input type="file" onChange={handleBannerChange} className="border rounded-lg w-full p-2" />
              {ngoBanner && <img src={ngoBanner} alt="Uploaded Banner" className="mt-2 w-32 h-32 object-cover" />}
            </div>

            {/* Save Image Button */}
            <button className="bg-teal-500 text-white py-2 px-4 rounded">Save Images</button>
          </div>
        )}

        {/* Additional content for "Payment Info", "Transaction Summary", etc. can be added here */}
      </div>
    </div>
  );
};

export default NGOCauseDetails;
