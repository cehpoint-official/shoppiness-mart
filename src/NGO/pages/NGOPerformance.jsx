import { Link } from 'react-router-dom';
import ShoppingBag from '../../assets/ShoppingBag.png';
import ProfilePic from '../../assets/googleicon.png'; // Replace with actual path
import NotificationIcon from '../../assets/googleicon.png'; // Replace with actual path
import NGOSidebar from '../components/NGOSidebar'; // Adjust the path if necessary
import NGONavbar from '../components/NGONavbar'; // Adjust the path if necessary

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

    <div className="flex-1 flex flex-col">
      <NGONavbar /> {/* Use the navbar component here */}
      
      <div className="p-6 bg-gray-100 flex-1">
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
  </div>
);

export default NGOPerformanceDashboardPage;
