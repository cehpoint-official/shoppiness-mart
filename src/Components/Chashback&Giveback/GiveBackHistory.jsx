import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { LuArrowUpDown } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";

const GiveBackHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const { userId } = useParams();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "givebackCashbacks"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const GivebackHistoryData = doc.data();
        if (GivebackHistoryData.userId === userId) {
          data.push({ id: doc.id, ...GivebackHistoryData });
        }
      });
      setHistory(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateString) => {
    return dateString.split("T")[0];
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    sortHistory(newOrder);
  };

  const sortHistory = (order) => {
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.completedAt);
      const dateB = new Date(b.completedAt);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
    setHistory(sortedHistory);
  };

  return (
    <div className="w-full h-full max-h-screen flex flex-col">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-white border-b">
        <button
          className="flex items-center gap-2 text-sm text-[#047E72] ml-auto"
          onClick={toggleSortOrder}
        >
          <LuArrowUpDown className="h-4 w-4 text-[#047E72]" />
          <span className="hidden sm:inline">Sort by Date</span> {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-[#FAFFFE] p-4 border border-[#D2EDEA] space-y-2 animate-pulse rounded-lg"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4 sm:w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 sm:w-1/6"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-full sm:w-3/4"></div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500">
              No giveback to any NGOs has been done yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-[#FAFFFE] p-4 border border-[#D2EDEA] space-y-2 rounded hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h3 className="text-base font-medium text-blue-700 break-words">
                    {item.ngoName}
                  </h3>
                  <h4 className="text-blue-700 text-sm">
                    {formatDate(item.completedAt)}
                  </h4>
                </div>
                <p className="text-sm text-gray-500 break-words">
                  Your Generous Giveback of Rs. {item.amount} to {item.ngoName} Has Been{" "}
                  {item.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GiveBackHistory;