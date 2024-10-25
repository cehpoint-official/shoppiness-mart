import React, { useState } from "react";
import { format } from "date-fns";
import Navbar from '../../components/Navbar'; // Adjust the path as necessary
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
  const totalNGOs = 100;
  const totalOfflineShops = 98;
  const totalOnlineShops = 2;
  const totalCashbackRequests = 60;
  const totalCoupons = 100;

  // State for selected time period
  const [timePeriod, setTimePeriod] = useState("monthly");

  // Sample data for coupons redeemed based on the time period
  const redeemedCoupons = {
    monthly: 40,
    weekly: 15,
    today: 5,
  };

  // Sample data for active and inactive shops
  const activeShops = 70;
  const inactiveShops = 30;

  // Sample data for donations
  const donations = [
    { name: "Alice", amount: 500 },
    { name: "Bob", amount: 300 },
    { name: "Charlie", amount: 450 },
    { name: "David", amount: 250 },
    { name: "Eva", amount: 400 },
  ];

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="text-lg">{format(new Date(), "MMMM d, yyyy")}</div>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-4">
            <div className="p-4 bg-white rounded shadow text-center">{totalNGOs} Total NGO's and Causes</div>
            <div className="p-4 bg-white rounded shadow text-center">{totalOfflineShops} Total Offline Shops</div>
            <div className="p-4 bg-white rounded shadow text-center">{totalOnlineShops} Online Shops</div>
            <div className="p-4 bg-white rounded shadow text-center">{totalCashbackRequests} Total Cashback Requests</div>
            <div className="p-4 bg-white rounded shadow text-center">{totalCoupons} Generated Coupons</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Generated Coupons Section */}
            <div className="p-4 bg-white rounded shadow">
              <h2 className="font-bold mb-2">Generated Coupons</h2>
              <div className="flex space-x-4 mb-4">
                <button onClick={() => handleTimePeriodChange("monthly")} className={`p-2 rounded ${timePeriod === "monthly" ? "bg-teal-500 text-white" : "bg-gray-200"}`}>
                  Monthly
                </button>
                <button onClick={() => handleTimePeriodChange("weekly")} className={`p-2 rounded ${timePeriod === "weekly" ? "bg-teal-500 text-white" : "bg-gray-200"}`}>
                  Weekly
                </button>
                <button onClick={() => handleTimePeriodChange("today")} className={`p-2 rounded ${timePeriod === "today" ? "bg-teal-500 text-white" : "bg-gray-200"}`}>
                  Today
                </button>
              </div>
              <div className="text-lg">
                Coupons Redeemed: {redeemedCoupons[timePeriod]}
              </div>
            </div>

            {/* Listed Shops Section */}
            <div className="p-4 bg-white rounded shadow">
              <h2 className="font-bold mb-2">Listed Shops</h2>
              <div className="flex space-x-4 mb-4">
                <button onClick={() => handleTimePeriodChange("monthly")} className={`p-2 rounded ${timePeriod === "monthly" ? "bg-teal-500 text-white" : "bg-gray-200"}`}>
                  Monthly
                </button>
                <button onClick={() => handleTimePeriodChange("weekly")} className={`p-2 rounded ${timePeriod === "weekly" ? "bg-teal-500 text-white" : "bg-gray-200"}`}>
                  Weekly
                </button>
                <button onClick={() => handleTimePeriodChange("today")} className={`p-2 rounded ${timePeriod === "today" ? "bg-teal-500 text-white" : "bg-gray-200"}`}>
                  Today
                </button>
              </div>
              <div className="text-lg">
                Shops Listed: {redeemedCoupons[timePeriod]} {/* You can adjust this as needed */}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Active Shops Section */}
            <div className="p-4 bg-white rounded shadow">
              <h2 className="font-bold mb-2">Active Shops</h2>
              <div className="text-lg">
                Active: {activeShops} | Inactive: {inactiveShops} | Total: {totalOfflineShops}
              </div>
            </div>

            {/* Total Donations Section */}
            <div className="p-4 bg-white rounded shadow">
              <h2 className="font-bold mb-2">Top Donations</h2>
              <div>
                {donations.map((donor, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{donor.name}</span>
                    <span>${donor.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
