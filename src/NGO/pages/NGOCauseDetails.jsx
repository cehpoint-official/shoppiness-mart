import React, { useState } from 'react';
import NGOSidebar from '../components/NGOSidebar';
import NGONavbar from '../components/NGONavbar';
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
      <NGOSidebar />

      <div className="flex-1 flex flex-col">
        {/* Navbar Component */}
        <NGONavbar />

        <div className="p-6 bg-gray-100 flex-1">
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
    </div>
  );
};

export default NGOCauseDetails;
