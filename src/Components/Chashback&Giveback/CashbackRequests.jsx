import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";

const CashbackRequests = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const couponsData = doc.data();
        if (couponsData.userId === userId) {
          data.push({ id: doc.id, ...couponsData });
        }
      });
      setCoupons(data);
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
    return dateString ? dateString.split("T")[0] : "-";
  };

  const filteredData = coupons.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.status.toUpperCase() === activeFilter;
  });

  const getNoDataMessage = () => {
    switch (activeFilter) {
      case "ALL":
        return "No coupons have been generated yet.";
      case "PENDING":
        return "No pending coupons at the moment.";
      case "CLAIMED":
        return "No coupons have been claimed yet.";
      default:
        return "No data available.";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter buttons - scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["ALL", "PENDING", "CLAIMED"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1 rounded-full text-sm whitespace-nowrap flex-shrink-0 ${
              activeFilter === filter
                ? "bg-blue-500 text-white"
                : "border-2 text-gray-400"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Desktop Table - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">#</th>
              <th className="py-2 px-4 border-b text-left">Shop Name</th>
              <th className="py-2 px-4 border-b text-left">Created Date</th>
              {(activeFilter === "CLAIMED" || activeFilter === "ALL") && (
                <th className="py-2 px-4 border-b text-left">Claimed Date</th>
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
                  {(activeFilter === "CLAIMED" || activeFilter === "ALL") && (
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
                    activeFilter === "CLAIMED" || activeFilter === "ALL" ? 6 : 5
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
                  <td className="py-2 px-4 border-b">{request.businessName}</td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(request.createdAt)}
                  </td>
                  {(activeFilter === "CLAIMED" || activeFilter === "ALL") && (
                    <td className="py-2 px-4 border-b">
                      {request.status === "Claimed"
                        ? formatDate(request.claimedAt)
                        : "-"}
                    </td>
                  )}
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

      {/* Mobile Card View - Shown only on Mobile */}
      <div className="md:hidden">
        {loading ? (
          // Loading skeleton for mobile
          Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index} 
              className="mb-4 bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-36"></div>
              </div>
            </div>
          ))
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
            {getNoDataMessage()}
          </div>
        ) : (
          filteredData.map((request, index) => (
            <div 
              key={request.id} 
              className="mb-4 bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-gray-900">
                  {request.businessName}
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-sm mr-2 ${
                      request.status === "Pending"
                        ? "text-[#F59E0B]"
                        : "text-[#22C55E]"
                    }`}
                  >
                    {request.status}
                  </span>
                  <button className="p-1">
                    <FaEllipsisV className="h-4 w-4 text-text-gray" />
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Created:</span>
                  <span>{formatDate(request.createdAt)}</span>
                </div>
                
                {(activeFilter === "CLAIMED" || activeFilter === "ALL") && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Claimed:</span>
                    <span>
                      {request.status === "Claimed"
                        ? formatDate(request.claimedAt)
                        : "-"}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between py-1">
                  <span>ID:</span>
                  <span className="text-gray-400">#{index + 1}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CashbackRequests;