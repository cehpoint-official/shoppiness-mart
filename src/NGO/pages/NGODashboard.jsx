import React from 'react';
import { Link } from 'react-router-dom';
import NGOSidebar from '../components/NGOSidebar';
import NGONavbar from '../components/NGONavbar';

import ProfilePic from '../../assets/googleicon.png'; // Replace with the actual image
import NotificationIcon from '../../assets/googleicon.png'; // Replace with the actual image
import SunNgoLogo from '../../assets/googleicon.png'; // Replace with the actual image

const NGODashboard = () => {
  return (
    <div className="flex">
      <NGOSidebar />
      <div className="flex-1 flex flex-col">
        <NGONavbar />

        <div className="p-6 bg-gray-100 flex-1">
          {/* Dashboard Text */}
          <div className="mb-6">
            <span className="text-2xl font-semibold text-blue-600">Dashboard</span>
          </div>

          {/* SUN NGO Section */}
          <div className="flex space-x-6 mb-6">
            <div className="flex items-center bg-white p-4 shadow-lg rounded-lg w-1/2">
              <img src={SunNgoLogo} alt="SUN NGO" className="w-12 h-12 mr-4" />
              <div>
                <h2 className="text-lg font-semibold">SUN NGO</h2>
                <p>Email: sunngo@example.com</p>
                <p>Phone: +1234567890</p>
                <button className="mt-4 bg-orange-600 text-white py-2 px-4 rounded">
                  Cause/NGO Details
                </button>
              </div>
            </div>

            {/* Total Donation and Support Section */}
            <div className="flex flex-col space-y-4 w-1/2">
              <div className="bg-white p-4 shadow-lg rounded-lg flex items-center justify-between">
                <span className="text-lg font-semibold">Total Donations</span>
                <span className="text-lg font-semibold">₹2000</span>
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg flex items-center justify-between">
                <span className="text-lg font-semibold">Total Support</span>
                <span className="text-lg font-semibold">500</span>
              </div>
            </div>
          </div>

          {/* New Supporters and Recent Transactions */}
          <div className="flex space-x-6">
            {/* New Supporters Box */}
            <div className="flex-1 bg-white p-4 shadow-lg rounded-lg">
              <h3 className="text-lg font-semibold mb-4">New Supporters</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>John Doe</span>
                  <span>john@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Jane Smith</span>
                  <span>jane@example.com</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions Box */}
            <div className="flex-1 bg-white p-4 shadow-lg rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Transaction 1</span>
                  <span>₹500</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction 2</span>
                  <span>₹1000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
