import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";

const WithdrawlRequests = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getNoDataMessage = () => {
    switch (activeFilter) {
      case "ALL":
        return "No withdrawal requests have been claimed yet.";
      case "PENDING":
        return "No pending withdrawal requests at the moment.";
      case "COLLECTED":
        return "No withdrawals have been collected yet.";
      default:
        return "No data available.";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {["ALL", "PENDING", "COLLECTED"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setCurrentPage(1); // Reset to the first page when filter changes
            }}
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
              <td colSpan="5" className="py-6 text-center text-gray-500">
                {getNoDataMessage()}
              </td>
            </tr>
          ) : (
            currentItems.map((request, index) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {indexOfFirstItem + index + 1}.
                </td>
                <td className="py-2 px-4 border-b">{request.amount}</td>
                <td className="py-2 px-4 border-b">
                  {formatDate(request.requestedAt)}
                </td>
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
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {filteredData.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-full text-sm ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-full text-sm ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-full text-sm ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default WithdrawlRequests;
