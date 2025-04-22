import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { MoreVertical } from "lucide-react";

const CashbackStatus = () => {
  const [activeTab, setActiveTab] = useState("Approved");
  const [currentPage, setCurrentPage] = useState(1);
  const [cashbackRequests, setCashbackRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCashbackRequests = async () => {
      try {
        setLoading(true);
        const cashbackRef = collection(db, "onlineCashbackRequests");
        const cashbackQuery = query(
          cashbackRef,
          where("status", "==", activeTab === "Approved" ? "Approved" : "Denied")
        );
        
        const querySnapshot = await getDocs(cashbackQuery);
        const requestsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setCashbackRequests(requestsData);
      } catch (err) {
        console.error("Error fetching cashback requests:", err);
        setError("Failed to load cashback requests");
      } finally {
        setLoading(false);
      }
    };

    fetchCashbackRequests();
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(cashbackRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedRequests = cashbackRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Format amount for display
  const formatAmount = (amount) => {
    return typeof amount === 'string' 
      ? parseInt(amount).toLocaleString('en-IN')
      : amount.toLocaleString('en-IN');
  };

  return (
    <div className="p-3 md:p-6">
      <h1 className="text-xl md:text-2xl font-normal mb-4 md:mb-8">Cashback Status</h1>

      <div className="bg-white rounded-lg border shadow-lg p-3 md:p-6">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-4 md:mb-8">
          <button
            className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full ${
              activeTab === "Approved"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => handleTabChange("Approved")}
          >
            Approved Cashbacks
          </button>
          <button
            className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full ${
              activeTab === "Denied"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => handleTabChange("Denied")}
          >
            Denied Cashbacks
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading cashback requests...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : cashbackRequests.length === 0 ? (
          <div className="text-center py-8">No {activeTab.toLowerCase()} cashback requests found.</div>
        ) : (
          <>
            {/* Table for medium and larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left font-medium">
                    <th className="pb-4 text-gray-500">#</th>
                    <th className="pb-4 text-gray-500">Code</th>
                    <th className="pb-4 text-gray-500">Shop Name</th>
                    <th className="pb-4 text-gray-500">Email</th>
                    <th className="pb-4 text-gray-500">Name</th>
                    <th className="pb-4 text-gray-500">Date</th>
                    <th className="pb-4 text-gray-500">Amount</th>
                    <th className="pb-4 text-gray-500">Status</th>
                    {/* <th className="pb-4 text-gray-500">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {displayedRequests.map((request, index) => (
                    <tr key={request.id} className="border-t">
                      <td className="py-4">{startIndex + index + 1}.</td>
                      <td className="py-4">{request.couponCode || "-"}</td>
                      <td className="py-4">{request.shopName}</td>
                      <td className="py-4">{request.userEmail}</td>
                      <td className="py-4">{request.userName}</td>
                      <td className="py-4">{request.requestedAt}</td>
                      <td className="py-4">₹{formatAmount(request.paidAmount)}</td>
                      <td className="py-4">
                        <span className={`${request.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
                          {request.status}
                        </span>
                      </td>
                      {/* <td className="py-4">
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards for small screens */}
            <div className="md:hidden space-y-4">
              {displayedRequests.map((request, index) => (
                <div key={request.id} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{request.shopName}</div>
                    {/* <button className="p-1 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button> */}
                  </div>
                  <div className="text-sm space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Code:</span>
                      <span className="font-bold">{request.couponCode || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">User:</span>
                      <span className="text-right">{request.userName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="text-gray-500 font-semibold">Email:</span>
                      <span className="text-left sm:text-right break-all">{request.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Date:</span>
                      <span>{request.requestedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Amount:</span>
                      <span>₹{formatAmount(request.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Status:</span>
                      <span className={`${request.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-500 order-2 md:order-1">
                Showing {Math.min(displayedRequests.length, itemsPerPage)} of{" "}
                {cashbackRequests.length}
              </div>
              
              <div className="flex items-center gap-1 md:gap-2 order-1 md:order-2">
                <button
                  className="px-2 py-1 md:px-4 md:py-2 text-sm disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {totalPages <= 5 ? (
                    [...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-sm text-xs md:text-sm ${
                          currentPage === i + 1
                            ? "bg-[#F59E0B] text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))
                  ) : (
                    <>
                      {currentPage > 2 && (
                        <button
                          className="w-6 h-6 md:w-8 md:h-8 rounded-sm text-xs md:text-sm hover:bg-gray-100"
                          onClick={() => setCurrentPage(1)}
                        >
                          1
                        </button>
                      )}
                      
                      {currentPage > 3 && <span className="px-1">...</span>}
                      
                      {[...Array(5)].map((_, i) => {
                        const pageNum = Math.max(
                          Math.min(currentPage - 2 + i, totalPages),
                          Math.max(i + 1, currentPage - 2)
                        );
                        if (pageNum <= 0 || pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            className={`w-6 h-6 md:w-8 md:h-8 rounded-sm text-xs md:text-sm ${
                              currentPage === pageNum
                                ? "bg-[#F59E0B] text-white"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {currentPage < totalPages - 2 && <span className="px-1">...</span>}
                      
                      {currentPage < totalPages - 1 && (
                        <button
                          className="w-6 h-6 md:w-8 md:h-8 rounded-sm text-xs md:text-sm hover:bg-gray-100"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      )}
                    </>
                  )}
                </div>
                
                <button
                  className="px-2 py-1 md:px-4 md:py-2 text-sm disabled:opacity-50"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CashbackStatus;