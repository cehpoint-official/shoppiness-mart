// NGOPerformanceDashboardPage.jsx
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import ShoppingBag from '../../assets/ShoppingBag.png';
import ProfilePic from '../../assets/googleicon.png'; // Replace with actual path
import NotificationIcon from '../../assets/googleicon.png'; // Replace with actual path
import NGOSidebar from '../components/NGOsidebar'; // Adjust the path if necessary

const TransactionHistoryItem = ({ id, date, amount }) => (
  <div className="border rounded-lg p-4 mb-4 bg-white shadow-md">
    <div className="flex justify-between items-center mb-2">
      <span className="font-bold">Shoppiness Mart</span>
      <span>ID: {id}</span>
    </div>
    <div className="flex justify-between items-center mb-2">
      <span>Date: {date}</span>
      <span>Amount: {amount}</span>
    </div>
    <div className="flex justify-between items-center">
      <span>Status: Received</span>
      <button className="text-teal-500">View Details</button>
    </div>
  </div>
);

const NGOPerformanceDashboardPage = () => (
  <div className="flex">
    <NGOSidebar /> {/* Use the sidebar component here */}

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

      {/* Main Content Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Cause/NGO Performance</h2>
        <div className="flex mt-6 space-x-4">
          {/* Total Donation Box */}
          <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Total Donation</h3>
            <p className="text-2xl font-bold mt-2">₹25,000</p>
          </div>

          {/* Total Users Box */}
          <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="text-2xl font-bold mt-2">500</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <Link to="/transaction-history" className="block text-teal-500 mb-6">View All Transactions</Link>
        <div>
          <TransactionHistoryItem id="1234" date="2024-09-10" amount="₹2000" />
          <TransactionHistoryItem id="1235" date="2024-09-09" amount="₹2000" />
          <TransactionHistoryItem id="1236" date="2024-09-08" amount="₹2000" />
          <TransactionHistoryItem id="1237" date="2024-09-07" amount="₹2000" />
          <TransactionHistoryItem id="1238" date="2024-09-06" amount="₹2000" />
        </div>
      </div>
    </div>
  </div>
);

export default NGOPerformanceDashboardPage;
