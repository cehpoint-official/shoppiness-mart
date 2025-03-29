import React, { useState, useEffect, useCallback } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../../../firebase";
import Loader from "../../../Components/Loader/Loader";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "pending", "verified", "rejected"

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    
    try {
      // Create a query against the transactions collection
      const q = query(
        collection(db, "transactions"),
        orderBy("lastUpdated", "desc")
      );
      
      // Set up a real-time listener
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const transactionsData = [];
        querySnapshot.forEach((doc) => {
          transactionsData.push({ id: doc.id, ...doc.data() });
        });
        setTransactions(transactionsData);
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
    const unsubscribe = fetchTransactions();
    
    // Clean up subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchTransactions]);

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "all") return true;
    return transaction.status === filter;
  });

  // Function to refresh transactions data from INRDeals API
  const refreshTransactionsFromAPI = async () => {
    setLoading(true);
    
    try {
      // Call your backend API to fetch and update transactions
      const today = new Date();
      const fourMonthsAgo = new Date();
      fourMonthsAgo.setMonth(today.getMonth() - 4);
      
      const startdate = fourMonthsAgo.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const enddate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // You would need to store this token securely, possibly in environment variables
      const token = import.meta.env.VITE_INRDEALS_API_TOKEN;
	    const serverUrl = import.meta.env.VITE_AWS_SERVER;
      
      const response = await fetch(
        `${serverUrl}/inrdeals/transactions?token=${token}&startdate=${startdate}&enddate=${enddate}`
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
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">User ID</th>
                <th className="py-2 px-4 border">Store</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Commission</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Sale Date</th>
                <th className="py-2 px-4 border">Last Updated</th>
                <th className="py-2 px-4 border">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-4 px-4 text-center">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="py-2 px-4 border">{transaction.userId}</td>
                    <td className="py-2 px-4 border">{transaction.storeName}</td>
                    <td className="py-2 px-4 border">
                      ₹{transaction.saleAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-2 px-4 border">
                      ₹{transaction.commission?.toFixed(2) || '0.00'}
                    </td>
                    <td className={`py-2 px-4 border ${
                      transaction.status === 'verified' 
                        ? 'text-green-600' 
                        : transaction.status === 'rejected' 
                          ? 'text-red-600' 
                          : 'text-yellow-600'
                    }`}>
                      {transaction.status}
                    </td>
                    <td className="py-2 px-4 border">
                      {transaction.saleDate ? new Date(transaction.saleDate.seconds * 1000).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border">
                      {transaction.lastUpdated ? new Date(transaction.lastUpdated.seconds * 1000).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border">
                      {transaction.transactionId || 'Not yet assigned'}
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