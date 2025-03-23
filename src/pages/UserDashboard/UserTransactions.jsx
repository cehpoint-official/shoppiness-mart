import React, { useState, useEffect, useCallback } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";

const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const fetchUserTransactions = useCallback(() => {
    if (!userId) return;
    
    setLoading(true);
    
    try {
      // Create a query against the transactions collection filtered by userId
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", userId),
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
      console.error("Error fetching user transactions:", error);
      setLoading(false);
    }
  }, [userId]);

  // Call fetchUserTransactions on component mount
  useEffect(() => {
    const unsubscribe = fetchUserTransactions();
    
    // Clean up subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchUserTransactions]);

  // Calculate total earned cashback
  const totalCashback = transactions
    .filter(t => t.status === "verified")
    .reduce((sum, t) => sum + (t.commission || 0), 0);

  // Calculate pending cashback
  const pendingCashback = transactions
    .filter(t => t.status === "pending")
    .reduce((sum, t) => sum + (t.commission || 0), 0);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">My Cashback Transactions</h1>
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4 md:items-center">
          <div className="bg-green-100 p-3 rounded">
            <p className="text-sm">Earned Cashback</p>
            <p className="text-xl font-bold text-green-600">₹{totalCashback.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded">
            <p className="text-sm">Pending Cashback</p>
            <p className="text-xl font-bold text-yellow-600">₹{pendingCashback.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Store</th>
                <th className="py-2 px-4 border">Purchase Amount</th>
                <th className="py-2 px-4 border">Cashback</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
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
                      {transaction.status === 'verified' 
                        ? 'Approved' 
                        : transaction.status === 'rejected' 
                          ? 'Rejected' 
                          : 'Pending'}
                      {transaction.status === 'pending' && (
                        <p className="text-xs text-gray-600 mt-1">
                          Approval in 45-60 days
                        </p>
                      )}
                    </td>
                    <td className="py-2 px-4 border">
                      {transaction.saleDate 
                        ? new Date(transaction.saleDate.seconds * 1000).toLocaleDateString() 
                        : transaction.lastUpdated 
                          ? new Date(transaction.lastUpdated.seconds * 1000).toLocaleDateString()
                          : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-50 rounded border">
        <h2 className="font-bold mb-2">About Cashback</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Cashbacks initially appear as 'Pending' for 45-60 days while merchants validate the purchases.</li>
          <li>Once validated, the status changes to 'Approved' and the cashback amount becomes available for withdrawal.</li>
          <li>Purchases may be rejected if they don't meet store terms (returned items, cancellations, etc).</li>
          <li>For more information, please contact our support team.</li>
        </ul>
      </div>
    </div>
  );
};

export default UserTransactions;