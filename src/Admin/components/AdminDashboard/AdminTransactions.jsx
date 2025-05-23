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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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
    // Reset to first page when filters change
    setCurrentPage(1);
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

  // Calculate total pages and determine which transactions to display for current page
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, startDate, endDate]);
  
  // Calculate pagination display based on screen width
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Determine how many page buttons to show based on screen size
  const getVisiblePageButtonCount = () => {
    if (screenWidth < 400) return 1; // Just current page on very small devices
    if (screenWidth < 640) return 3; // 3 pages on small mobile
    return 5; // 5 pages on larger screens
  };

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

  // Format date for display in transaction cards/rows
  const formatTransactionDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  // Go to a specific page
  const goToPage = (pageNumber) => {
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Transaction Management</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Date picker section */}
          <div className="relative w-full md:w-auto">
            <button
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border w-full md:w-auto justify-between md:justify-start"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <BsCalendar4 className="text-blue-600" />
              <span className="text-sm md:text-base truncate">{formatDateRange()}</span>
            </button>

            {showDatePicker && (
              <div className="absolute right-0 mt-2 bg-white p-4 rounded-lg shadow-lg z-10 w-full md:w-auto">
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
                  <div className="flex justify-center space-x-2">
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
            className="border rounded p-2 w-full md:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
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
        <>
          {/* Desktop View (Table) - Hidden on small screens */}
          <div className="hidden md:block overflow-x-auto">
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
                {currentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-4 px-4 text-center">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  currentTransactions.map((transaction) => (
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
                      <td className={`py-2 px-4 border text-center ${getStatusColorClass(transaction.status)}`}>
                        {transaction.status}
                      </td>
                      <td className="py-2 px-4 border text-sm">
                        {formatTransactionDate(transaction.saleDate || transaction.clickDate)}
                      </td>
                      <td className="py-2 px-4 border text-sm">
                        {formatTransactionDate(transaction.lastUpdated)}
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

          {/* Mobile View (Cards) - Shown only on small screens */}
          <div className="md:hidden">
            {currentTransactions.length === 0 ? (
              <div className="bg-white p-4 text-center rounded shadow">
                No transactions found
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {currentTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-white p-4 rounded shadow">
                    <div className="flex flex-col sm:flex-row justify-between mb-2">
                      <div className="font-medium mb-1 sm:mb-0 pr-4">{userNames[transaction.userId] || "Unknown"}</div>
                      <div className={`px-2 py-1 rounded-full text-xs ${getStatusColorClass(transaction.status)} bg-opacity-20 font-medium uppercase self-start`}>
                        {transaction.status}
                      </div>
                    </div>
                    <div className="mb-2 text-sm text-gray-700 truncate">
                      <span className="font-medium">Store:</span> {transaction.storeName}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
                      <div>
                        <span className="font-medium">Amount:</span> ₹{transaction.saleAmount?.toFixed(2) || '0.00'}
                      </div>
                      <div>
                        <span className="font-medium">Commission:</span> ₹{transaction.commission?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Sale Date:</span> {formatTransactionDate(transaction.saleDate || transaction.clickDate)}
                      </div>
                      <div className="mt-1">
                        <span className="font-medium">Updated:</span> {formatTransactionDate(transaction.lastUpdated)}
                      </div>
                      <div className="mt-1 truncate">
                        <span className="font-medium">ID:</span> {transaction.transactionId || 'Not assigned'}
                      </div>
                      <div className="mt-1 truncate" title={transaction.userId}>
                        <span className="font-medium">User ID:</span> {formatUserId(transaction.userId)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredTransactions.length > 0 && (
            <div className="flex justify-center mt-6">
              <nav className="flex flex-wrap items-center justify-center gap-1">
                {/* First/Prev buttons - hide on smallest screens */}
                <div className="hidden sm:flex items-center space-x-1">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 text-sm rounded ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    First
                  </button>
                </div>
                
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 text-sm rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  aria-label="Previous Page"
                >
                  &laquo;
                </button>
                
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {/* Dynamic page buttons - show fewer on mobile */}
                  {Array.from(
                    { length: Math.min(getVisiblePageButtonCount(), totalPages) }, 
                    (_, i) => {
                      // Calculate which page numbers to show based on current page and screen size
                      let pageNum;
                      const maxVisible = getVisiblePageButtonCount();
                      
                      if (totalPages <= maxVisible) {
                        // If we have fewer pages than maxVisible, show all pages
                        pageNum = i + 1;
                      } else if (currentPage <= Math.ceil(maxVisible / 2)) {
                        // If we're near the start
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
                        // If we're near the end
                        pageNum = totalPages - (maxVisible - 1) + i;
                      } else {
                        // Otherwise show pages around current page
                        const offset = Math.floor(maxVisible / 2);
                        pageNum = currentPage - offset + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 text-sm rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  aria-label="Next Page"
                >
                  &raquo;
                </button>
                
                {/* Last button - hide on smallest screens */}
                <div className="hidden sm:flex items-center space-x-1">
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 text-sm rounded ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Last
                  </button>
                </div>
              </nav>
            </div>
          )}

          {/* Pagination Info - Different layouts for mobile/desktop */}
          {filteredTransactions.length > 0 && (
            <div className="mt-2 text-gray-600">
              <div className="text-center text-sm">
                <span className="inline-block">
                  Page {currentPage} of {totalPages}
                </span>
                <span className="hidden sm:inline-block sm:mx-1">|</span>
                <span className="block sm:inline-block">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTransactions.length)} 
                  of {filteredTransactions.length}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTransactions;