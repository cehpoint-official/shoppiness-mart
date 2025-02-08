import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
const WithdrawlRequests = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "WithdrawCashback"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const withdrawsData = doc.data();
        if (withdrawsData.userId === userId) {
          data.push({ id: doc.id, ...withdrawsData });
        }
      });
      setWithdraws(data);
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
  const filteredData = withdraws.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.status.toUpperCase() === activeFilter;
  });

  console.log(withdraws);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {["ALL", "PENDING", "COLLECTED"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1 rounded-full text-sm ${
              activeFilter === filter
                ? "bg-blue-500 text-white"
                : "border-2 text-gray-400"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">#</th>
            <th className="py-2 px-4 border-b text-left">Amount</th>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Payment Type</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-2 px-4 border-b">
                    <div className="h-4 bg-gray-300 rounded w-6"></div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="h-4 bg-gray-300 rounded w-8"></div>
                  </td>
                </tr>
              ))
            : filteredData.map((request, index) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}.</td>
                  <td className="py-2 px-4 border-b">{request.amount}</td>
                  <td className="py-2 px-4 border-b">{formatDate(request.requestedAt)}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`${
                        request.status === "Pending"
                          ? "text-[#F59E0B]"
                          : "text-[#22C55E]"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                  {request.selectedPayment.type}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};
export default WithdrawlRequests;
