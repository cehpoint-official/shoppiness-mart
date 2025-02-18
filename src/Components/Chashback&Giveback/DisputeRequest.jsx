import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";

const DisputeRequest = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [allDisputeRequest, setAllDisputeRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(
        collection(db, "cashbackDisputeRequests")
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        const disputeRequestData = doc.data();
        if (disputeRequestData.userId === userId) {
          data.push({ id: doc.id, ...disputeRequestData });
        }
      });
      setAllDisputeRequest(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = allDisputeRequest.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.status.toUpperCase() === activeFilter;
  });

  const getNoDataMessage = () => {
    switch (activeFilter) {
      case "ALL":
        return "No dispute request have been made yet.";
      case "PENDING":
        return "No pending request at the moment.";
      case "RESOLVED":
        return "No dispute request have been resolved yet.";
      case "REJECTED":
        return "No dispute request have been rejected yet.";
      default:
        return "No data available.";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {["ALL", "PENDING", "RESOLVED", "REJECTED"].map((filter) => (
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
            <th className="py-2 px-4 border-b text-left">Shop Name</th>
            <th className="py-2 px-4 border-b text-left">Requested Date</th>
            {(activeFilter === "RESOLVED" || activeFilter === "ALL") && (
              <th className="py-2 px-4 border-b text-left">Resolved Date</th>
            )}
            {(activeFilter === "REJECTED" || activeFilter === "ALL") && (
              <th className="py-2 px-4 border-b text-left">Rejected Date</th>
            )}
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
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
                {(activeFilter === "RESOLVED" || activeFilter === "ALL") && (
                  <td className="py-2 px-4 border-b">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </td>
                )}
                {(activeFilter === "REJECTED" || activeFilter === "ALL") && (
                  <td className="py-2 px-4 border-b">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </td>
                )}
                <td className="py-2 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-8"></div>
                </td>
              </tr>
            ))
          ) : filteredData.length === 0 ? (
            <tr>
              <td
                colSpan={
                  activeFilter === "RESOLVED" || activeFilter === "ALL"
                    ? activeFilter === "REJECTED"
                      ? 7
                      : 6
                    : 5
                }
                className="py-6 text-center text-gray-500"
              >
                {getNoDataMessage()}
              </td>
            </tr>
          ) : (
            filteredData.map((request, index) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{index + 1}.</td>
                <td className="py-2 px-4 border-b">{request.shopName}</td>
                <td className="py-2 px-4 border-b">{request.requestedAt}</td>
                {(activeFilter === "RESOLVED" || activeFilter === "ALL") && (
                  <td className="py-2 px-4 border-b">
                    {request.status === "Resolved" ? request.resolvedAt : "-"}
                  </td>
                )}
                {(activeFilter === "REJECTED" || activeFilter === "ALL") && (
                  <td className="py-2 px-4 border-b">
                    {request.status === "Rejected" ? request.rejectedAt : "-"}
                  </td>
                )}
                <td className="py-2 px-4 border-b">
                  <span
                    className={`${
                      request.status === "Pending"
                        ? "text-[#F59E0B]"
                        : request.status === "Rejected"
                        ? "text-[#EF4444]"
                        : "text-[#22C55E]"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <button className="p-1">
                    <FaEllipsisV className="h-4 w-4 text-text-gray" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DisputeRequest;