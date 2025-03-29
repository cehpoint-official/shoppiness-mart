import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase"; // Adjust the import path as needed

const TransactionSummary = () => {
  const [givebacks, setGivebacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "givebackCashbacks"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const GivebackHistoryData = doc.data();
        if (GivebackHistoryData.ngoId === id) {
          data.push({ id: doc.id, ...GivebackHistoryData });
        }
      });
      setGivebacks(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transform givebacks into transactions
  const transactions = givebacks
    .filter((item) => item.status === "Completed") // Only include completed transactions
    .map((item) => ({
      id: item.id, // Use the transaction ID from givebacks
      name: item.userName,
      date: new Date(item.paidAt || item.requestedAt).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
        }
      ), // Format date
      amount: item.amount, // Use the amount from givebacks
    }));

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg font-medium text-gray-900">Transaction Summary</h2>

      <div className="space-y-4">
        {loading ? (
          // Skeleton loading effect
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))
        ) : transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                  ₹
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.name}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                  <button className="text-sm text-blue-600 hover:underline">
                    See more
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Payment received</p>
                <p className="font-medium text-green-600">
                  Rs. {transaction.amount}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionSummary;
