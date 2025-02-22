import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiMoreVertical, FiFileText } from "react-icons/fi";
import { db } from "../../../../../firebase";

const CashbackRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [allCashbackRequests, setAllCashbackRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 5;
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "onlineCashbackRequests")
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        const cashbackRequestsData = doc.data();
        data.push({ shopId: doc.id, ...cashbackRequestsData });
      });
      setAllCashbackRequests(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate pagination
  const totalPages = Math.ceil(allCashbackRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCashbackRequests = allCashbackRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (selectedRequest) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setSelectedRequest(null)}
            className="flex items-center gap-2 text black hover:text-gray-900"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="text-lg ">Cashback request details</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md border p-8">
          <div className="grid grid-cols-2 gap-y-8">
            <div>
              <div className="text-gray-500 mb-1">User Name</div>
              <div className="font-medium">{selectedRequest.userName}</div>
            </div>

            <div>
              <div className="text-gray-500 mb-1">User Email</div>
              <div className="font-medium">{selectedRequest.userEmail}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Shop Name</div>
              <div className="font-medium">{selectedRequest.shopName}</div>
            </div>

            <div>
              <div className="text-gray-500 mb-1">Shop Email</div>
              <div className="font-medium">{selectedRequest.shopEmail}</div>
            </div>

            <div>
              <div className="text-gray-500 mb-1">Paid Amount</div>
              <div className="font-medium">{selectedRequest.paidAmount}</div>
            </div>

            <div>
              <div className="text-gray-500 mb-1">Shop Phone No.</div>
              <div className="font-medium">{selectedRequest.shopPhone}</div>
            </div>

            <div className="flex items-start gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Payment Method</div>
                <div className="font-medium text-gray-900 mb-2">
                  {selectedRequest.selectedPayment?.type === "bank"
                    ? "Bank Transfer"
                    : "UPI Payment"}
                </div>
                {selectedRequest.selectedPayment?.type === "bank" ? (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">
                      {selectedRequest.selectedPayment?.bankName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedRequest.selectedPayment?.accountNumber}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedRequest.selectedPayment?.ifscCode}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    {selectedRequest.selectedPayment?.upiId}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="text-gray-500 mb-1">Requested Date</div>
              <div className="font-medium">{selectedRequest.requestedAt}</div>
            </div>

            <div>
              <div className="text-gray-500 mb-1">Invoice</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <FiFileText className="w-5 h-5 text-red-500" />
                  <span>{selectedRequest.invoice}</span>
                </div>
                <button className="px-3 py-1 bg-gray-200 rounded text-sm">
                  Download
                </button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                  View
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-12">
            <button className="px-4 py-2 bg-gray-200 rounded">
              Request Denied
            </button>
            <button className="px-4 py-2 bg-[#F59E0B] text-white rounded">
              Mark as Paid
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-normal mb-8">Cashback Requests</h1>

      <div className="bg-white rounded-lg border shadow-lg p-6">
        {/* Tabs */}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left font-medium">
                <th className="pb-4  text-gray-500">#</th>
                <th className="pb-4  text-gray-500">Code</th>
                <th className="pb-4 text-gray-500">Shop Name</th>
                <th className="pb-4  text-gray-500">User Email</th>
                <th className="pb-4  text-gray-500">User Name</th>
                <th className="pb-4 text-gray-500">Requested Date</th>
                <th className="pb-4  text-gray-500">Status</th>
                <th className="pb-4 text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(itemsPerPage)].map((_, index) => (
                  <tr key={index} className="border-t animate-pulse">
                    <td className="py-4"><div className="h-4 w-4 bg-gray-200 rounded"></div></td>
                    <td className="py-4"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
                    <td className="py-4"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
                    <td className="py-4"><div className="h-4 w-40 bg-gray-200 rounded"></div></td>
                    <td className="py-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
                    <td className="py-4"><div className="h-4 w-28 bg-gray-200 rounded"></div></td>
                    <td className="py-4"><div className="h-4 w-16 bg-gray-200 rounded text-[#F59E0B]"></div></td>
                    <td className="py-4">
                      <div className="p-1 h-7 w-7 bg-gray-200 rounded-full"></div>
                    </td>
                  </tr>
                ))
              ) : (
                displayedCashbackRequests.map((request, index) => (
                  <tr key={request.id} className="border-t">
                    <td className="py-4">{index + 1}.</td>
                    <td className="py-4">{request.couponCode}</td>
                    <td className="py-4">{request.shopName}</td>
                    <td className="py-4">{request.userEmail}</td>
                    <td className="py-4">{request.userName}</td>
                    <td className="py-4">{request.requestedAt}</td>
                    <td className="py-4">
                      <span className="text-[#F59E0B]">{request.status}</span>
                    </td>
                    <td className="py-4">
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                          <FiMoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {isLoading ? (
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <>
                Showing {Math.min(itemsPerPage, allCashbackRequests.length)} of{" "}
                {allCashbackRequests.length}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <button
                  className="px-4 py-2 text-sm disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`w-8 h-8 rounded-sm text-sm ${
                      currentPage === i + 1
                        ? "bg-[#F59E0B] text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-4 py-2 text-sm disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashbackRequests;