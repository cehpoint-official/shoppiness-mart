import React, { useState } from 'react';
import Navbar from '../../../components/Navbar'; // Adjust the path as necessary
import Sidebar from '../../../components/Sidebar'; // Adjust the path as necessary

const EditPages = () => {
  const [activeToggle, setActiveToggle] = useState(null);

  const handleToggle = (index) => {
    setActiveToggle(activeToggle === index ? null : index);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <div className="p-6 bg-gray-100 flex-grow">
          <h1 className="text-2xl font-bold mb-4">Edit Pages</h1>

          {/* Home Toggle */}
          <div>
            <div
              onClick={() => handleToggle(0)}
              className="flex justify-between items-center cursor-pointer py-2 px-4 bg-gray-200 rounded-md mb-2"
            >
              <span>HOME</span>
              <span>{activeToggle === 0 ? '−' : '+'}</span>
            </div>
            {activeToggle === 0 && (
              <div className="pl-6 flex flex-col space-y-2">
                <button className="py-2 px-4 bg-blue-500 text-white rounded-md">Upload Banner Image</button>
                <button className="py-2 px-4 bg-blue-500 text-white rounded-md">Edit Home Content</button>
              </div>
            )}
          </div>

          {/* How It Works Toggle */}
          <div>
            <div
              onClick={() => handleToggle(1)}
              className="flex justify-between items-center cursor-pointer py-2 px-4 bg-gray-200 rounded-md mb-2"
            >
              <span>HOW IT WORKS</span>
              <span>{activeToggle === 1 ? '−' : '+'}</span>
            </div>
            {activeToggle === 1 && (
              <div className="pl-6 flex flex-col space-y-2">
                <button className="py-2 px-4 bg-blue-500 text-white rounded-md">Upload Video</button>
                <button className="py-2 px-4 bg-blue-500 text-white rounded-md">Edit Video Description</button>
              </div>
            )}
          </div>

          {/* Privacy Policy Toggle */}
          <div>
            <div
              onClick={() => handleToggle(2)}
              className="flex justify-between items-center cursor-pointer py-2 px-4 bg-gray-200 rounded-md mb-2"
            >
              <span>PRIVACY POLICY</span>
              <span>{activeToggle === 2 ? '−' : '+'}</span>
            </div>
            {activeToggle === 2 && (
              <div className="pl-6 flex flex-col space-y-2">
                <button className="py-2 px-4 bg-blue-500 text-white rounded-md">Edit Policy Text</button>
                <button className="py-2 px-4 bg-blue-500 text-white rounded-md">Add Policy Section</button>
              </div>
            )}
          </div>

          {/* About Us Toggle */}
          <div>
            <div
              onClick={() => handleToggle(3)}
              className="flex justify-between items-center cursor-pointer py-2 px-4 bg-gray-200 rounded-md mb-2"
            >
              <span>ABOUT US</span>
              <span>{activeToggle === 3 ? '−' : '+'}</span>
            </div>
            {activeToggle === 3 && (
              <div className="pl-6 flex flex-col space-y-2">
                <button className="py-2 px-4 bg-blue-500 text-white rounded-md">Edit Story</button>
                <button className="py-2 px-4 bg-blue-500 text-white rounded-md">Upload Members' Images</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPages;
