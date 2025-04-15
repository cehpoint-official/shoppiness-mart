import React, { useState, useEffect, useCallback } from "react";
import { collection, query, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import Loader from "../../../Components/Loader/Loader";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendar4 } from "react-icons/bs";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "pending", "verified", "rejected"
  const [userNames, setUserNames] = useState({});
  
  // Date picker states
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 4))); // Default to 4 months ago
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Format date for display in "1 Jan 2024" format
  const formatDateForDisplay = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Format date range for display
  const formatDateRange = () => {
    return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
  };

  // Handle date selection - enforce 4 month maximum
  const handleStartDateChange = (date) => {
    // Calculate the maximum allowed start date (4 months before end date)
    const maxStartDate = new Date(endDate);
    maxStartDate.setMonth(maxStartDate.getMonth() - 4);
    
    // If selected date is earlier than max allowed start date, set it to max allowed
    if (date < maxStartDate) {
      setStartDate(maxStartDate);
    } else {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    // Calculate the minimum allowed end date (4 months after start date)
    const minEndDate = new Date(startDate);
    minEndDate.setMonth(minEndDate.getMonth() + 4);
    
    // If selected date is later than min allowed end date, set it to min allowed
    if (date > minEndDate) {
      setEndDate(minEndDate);
    } else {
      setEndDate(date);
    }
  };

  // Apply date range and close date picker
  const handleDateRangeApply = () => {
    setShowDatePicker(false);
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);

    try {
      // Create a query against the transactions collection
      const q = query(
        collection(db, "transactions"),
        orderBy("lastUpdated", "desc")
      );

      // Set up a real-time listener
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const transactionsData = [];
        const userIds = new Set();
        const validTransactions = [];
        const userNamesMap = {};

        // First, collect all transaction data and unique userIds
        querySnapshot.forEach((doc) => {
          const transaction = { id: doc.id, ...doc.data() };
          transactionsData.push(transaction);
          if (transaction.userId) {
            userIds.add(transaction.userId);
          }
        });

        // Fetch user data for all unique userIds
        const userPromises = Array.from(userIds).map(async (userId) => {
          try {
            const userDocRef = doc(db, "users", userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              userNamesMap[userId] = userData.fname || "Unknown";

              // Add transactions with valid users to validTransactions
              transactionsData
                .filter(transaction => transaction.userId === userId)
                .forEach(transaction => validTransactions.push(transaction));
            }
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
          }
        });

        // Wait for all user fetches to complete
        await Promise.all(userPromises);

        setUserNames(userNamesMap);
        setTransactions(validTransactions);
        setLoading(false);
      });

      // Clean up the listener when the component unmounts
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  }, []);

  // Call fetchTransactions on component mount
  useEffect(() => {
    // Clean up the listener when the component unmounts
    let unsubscribe;

    const run = async () => {
      unsubscribe = await fetchTransactions();
    };

    run();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchTransactions]);

  // Function to truncate user ID and add tooltip
  const formatUserId = (userId) => {
    if (!userId) return "N/A";
    return userId.length > 10 ? `${userId.substring(0, 8)}...` : userId;
  };

  // Filter transactions based on status and date range
  const filteredTransactions = transactions.filter(transaction => {
    // First filter by status
    if (filter !== "all" && transaction.status !== filter) return false;

    // Then filter by date range
    // Get the transaction date - prioritize saleDate, fall back to clickDate
    let transactionDate = null;
    if (transaction.saleDate && transaction.saleDate.seconds) {
      transactionDate = new Date(transaction.saleDate.seconds * 1000);
    } else if (transaction.clickDate && transaction.clickDate.seconds) {
      transactionDate = new Date(transaction.clickDate.seconds * 1000);
    }

    // If transaction has no valid date, exclude it
    if (!transactionDate) return false;

    // Check if transaction date is within range
    if (startDate && transactionDate < startDate) return false;

    // For end date, set it to end of day for inclusive comparison
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (transactionDate > endOfDay) return false;
    }

    return true;
  });

  // Function to refresh transactions data from INRDeals API
  const refreshTransactionsFromAPI = async () => {
    setLoading(true);

    try {
      // Format dates for API in YYYY-MM-DD format
      const apiStartDate = startDate.toISOString().split('T')[0];
      const apiEndDate = endDate.toISOString().split('T')[0];

      // You would need to store this token securely, possibly in environment variables
      const token = import.meta.env.VITE_INRDEALS_API_TOKEN;
      const serverUrl = import.meta.env.VITE_AWS_SERVER;

      const response = await fetch(
        `${serverUrl}/inrdeals/transactions?token=${token}&startdate=${apiStartDate}&enddate=${apiEndDate}`
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        console.log("Transactions refreshed successfully", data);
      } else {
        console.error("Failed to refresh transactions:", data.message);
      }
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transaction Management</h1>
        <div className="flex gap-4">
          {/* Date picker section */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <BsCalendar4 className="text-blue-600" />
              <span>{formatDateRange()}</span>
            </button>
            
            {showDatePicker && (
              <div className="absolute right-0 mt-2 bg-white p-4 rounded-lg shadow-lg z-10">
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="w-full p-2 border rounded"
                      dateFormat="d MMM yyyy"
                      maxDate={new Date(endDate.getTime() - (86400000 * 30))} // At least 30 days before end date
                    />
                    <div className="text-xs text-gray-500 mt-1">Maximum range: 4 months</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      maxDate={new Date(startDate.getTime() + (86400000 * 120))} // Max 120 days (4 months) after start date
                      className="w-full p-2 border rounded"
                      dateFormat="d MMM yyyy"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded text-sm"
                      onClick={() => setShowDatePicker(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                      onClick={handleDateRangeApply}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <select
            className="border rounded p-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={refreshTransactionsFromAPI}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border w-24">User ID</th>
                <th className="py-2 px-4 border w-32">User Name</th>
                <th className="py-2 px-4 border w-32">Store</th>
                <th className="py-2 px-4 border w-24">Amount</th>
                <th className="py-2 px-4 border w-24">Commission</th>
                <th className="py-2 px-4 border w-24">Status</th>
                <th className="py-2 px-4 border w-32">Sale Date</th>
                <th className="py-2 px-4 border w-32">Last Updated</th>
                <th className="py-2 px-4 border w-28">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-4 px-4 text-center">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="py-2 px-4 border truncate" title={transaction.userId}>
                      <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        {formatUserId(transaction.userId)}
                      </div>
                    </td>
                    <td className="py-2 px-4 border truncate">
                      {userNames[transaction.userId] || "Unknown"}
                    </td>
                    <td className="py-2 px-4 border truncate" title={transaction.storeName}>
                      {transaction.storeName}
                    </td>
                    <td className="py-2 px-4 border text-right">
                      ₹{transaction.saleAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-2 px-4 border text-right">
                      ₹{transaction.commission?.toFixed(2) || '0.00'}
                    </td>
                    <td className={`py-2 px-4 border text-center ${transaction.status === 'verified'
                        ? 'text-green-600'
                        : transaction.status === 'rejected'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}>
                      {transaction.status}
                    </td>
                    <td className="py-2 px-4 border text-sm">
                      {transaction.saleDate ? 
                        new Date(transaction.saleDate.seconds * 1000).toLocaleString(undefined, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : 
                        transaction.clickDate ? 
                          new Date(transaction.clickDate.seconds * 1000).toLocaleString(undefined, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border text-sm">
                      {transaction.lastUpdated ? new Date(transaction.lastUpdated.seconds * 1000).toLocaleString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border truncate" title={transaction.transactionId || ''}>
                      {transaction.transactionId || 'Not assigned'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;