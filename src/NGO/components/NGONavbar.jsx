// src/NGO/components/NGONavbar.jsx
import React from 'react';
import { FiBell } from 'react-icons/fi'; // Import the bell icon
import ProfilePic from '../../assets/googleicon.png'; // Replace with the actual image

const NGONavbar = () => {
  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold">Welcome Jit 👋</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
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
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none">
                <FiBell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  4
                </span>
              </button>
            </div>
            <img
              className="h-8 w-8 rounded-full"
              src={ProfilePic}
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGONavbar;
