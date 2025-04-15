import React, { useState, useEffect, useCallback } from "react";
import { collection, query, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import Loader from "../../../Components/Loader/Loader";

const AdminTransactions = ({ startDate, endDate }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "pending", "verified", "rejected"
  const [userNames, setUserNames] = useState({});

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

  // Parse date strings like "21 Jan 2025" to Date objects
  const parseInputDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split(' ');
    const day = parseInt(parts[0]);
    const month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
      .indexOf(parts[1].toLowerCase());
    const year = parseInt(parts[2]);

    if (month === -1) return null;

    // Create date at beginning of day
    return new Date(year, month, day, 0, 0, 0);
  };

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
    const start = parseInputDate(startDate);
    const end = parseInputDate(endDate);

    // If dates are invalid or not provided, don't filter by date
    if (!start && !end) return true;

    // Get the transaction date
    let transactionDate = null;
    if (transaction.saleDate && transaction.saleDate.seconds) {
      transactionDate = new Date(transaction.saleDate.seconds * 1000);
    }

    // If transaction has no valid date, exclude it
    if (!transactionDate) return false;

    // Check if transaction date is within range
    if (start && transactionDate < start) return false;

    // For end date, set it to end of day for inclusive comparison
    if (end) {
      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);
      if (transactionDate > endOfDay) return false;
    }

    return true;
  });

  // Function to refresh transactions data from INRDeals API
  const refreshTransactionsFromAPI = async () => {
    setLoading(true);

    try {
      // Convert the startDate and endDate props to the required format (YYYY-MM-DD)
      let apiStartDate, apiEndDate;

      // Use the provided dates if available, otherwise use default of 4 months ago to today
      if (startDate) {
        const parsedDate = parseInputDate(startDate);
        if (parsedDate) {
          apiStartDate = parsedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
      }

      if (endDate) {
        const parsedDate = parseInputDate(endDate);
        if (parsedDate) {
          apiEndDate = parsedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
      }

      // Fallback to default dates if parsing failed or dates weren't provided
      if (!apiStartDate) {
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
        apiStartDate = fourMonthsAgo.toISOString().split('T')[0];
      }

      if (!apiEndDate) {
        apiEndDate = new Date().toISOString().split('T')[0];
      }

      // You would need to store this token securely, possibly in environment variables
      const token = import.meta.env.VITE_INRDEALS_API_TOKEN;
      const serverUrl = import.meta.env.VITE_AWS_SERVER;

      const response = await fetch(
        `${serverUrl}/inrdeals/transactions?token=${token}&startdate=${apiStartDate}&enddate=${apiEndDate}`
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        console.log("Transactions refreshed successfully");
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
                      {transaction.saleDate ? new Date(transaction.saleDate.seconds * 1000).toLocaleString(undefined, {
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