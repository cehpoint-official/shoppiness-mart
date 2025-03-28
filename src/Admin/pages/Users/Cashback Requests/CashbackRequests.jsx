import { collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiFileText } from "react-icons/fi";
import { db } from "../../../../../firebase";
import toast from "react-hot-toast";

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
      console.error("Error getting documents: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markCashbackRequestAsRead = async (couponCode) => {
    try {
      const snapshot = await getDocs(collection(db, 'onlineCashbackRequests'));
      const matchingDoc = snapshot.docs.find(doc => doc.data().couponCode === couponCode);

      if (!matchingDoc) {
        console.error("No document found with couponCode: ", couponCode);
        return;
      }

      const docRef = doc(db, 'onlineCashbackRequests', matchingDoc.id);

      await updateDoc(docRef, {
        status: 'Approved'
      });

      console.log("Cashback request marked as approved");
    } catch (error) {
      console.error("Error marking cashback request as read: ", error);
    }
  };

  const handleCashbackRequest = async (request, action) => {
    try {
      // Determine status and message based on action
      const statusMapping = {
        'paid': {
          status: 'Paid',
          message: `Great news! Your cashback request for ${request.shopName} has been paid.`
        },
        'denied': {
          status: 'Denied',
          message: `We regret to inform you that your cashback request for ${request.shopName} has been denied.`
        }
      };

      const actionDetails = statusMapping[action];

      if (!actionDetails) {
        throw new Error('Invalid action');
      }

      // Create a user notification
      const userNotificationRef = doc(collection(db, "userNotifications"));
      const currentTime = new Date().toISOString();

      await setDoc(userNotificationRef, {
        message: actionDetails.message,
        userId: request.userEmail,
        read: false,
        createdAt: currentTime,
      });
      toast.success(`Cashback request ${action} successfully!`);

      await fetchData();
      setSelectedRequest(null);
    } catch (error) {
      console.error(`Error handling cashback request ${action}:`, error);
      toast.error("Failed to process cashback request. Please try again.");
    }
  };

  const handleViewDetails = async (request) => {
    await markCashbackRequestAsRead(request.couponCode);
    setSelectedRequest(request);
    await fetchData();
  };

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
            className="flex items-center gap-2 text-black hover:text-gray-900"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="text-lg">Cashback request details</span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md border p-8">
          <div className="grid grid-cols-2 gap-y-8">
            <div>
              <div className="text-gray-500 mb-1">User Name</div>
              <div className="font-medium">{selectedRequest.userName || 'undefined'}</div>
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
            <div>
              <div className="text-gray-500 mb-1">Payment Method</div>
              <div className="font-medium">UPI Payment</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Requested Date</div>
              <div className="font-medium">{selectedRequest.requestedAt}</div>
            </div>
          </div>
          <div className="mt-8 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FiFileText className="w-6 h-6 text-red-500" />
              <span>Invoice</span>
            </div>
            <div className="flex gap-2">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded">
                Download
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                View
              </button>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button 
              onClick={() => handleCashbackRequest(selectedRequest, 'denied')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded">
              Request Denied
            </button>
            <button 
              onClick={() => handleCashbackRequest(selectedRequest, 'paid')}
              className="bg-orange-500 text-white px-4 py-2 rounded">
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left font-medium">
                <th className="pb-4 text-gray-500">#</th>
                <th className="pb-4 text-gray-500">Shop Name</th>
                <th className="pb-4 text-gray-500">User Email</th>
                <th className="pb-4 text-gray-500">User Name</th>
                <th className="pb-4 text-gray-500">Requested Date</th>
                <th className="pb-4 text-gray-500">Status</th>
                <th className="pb-4 text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(itemsPerPage)].map((_, index) => (
                  <tr key={index} className="border-t animate-pulse">
                    <td className="py-4"><div className="h-4 w-4 bg-gray-200 rounded"></div></td>
                    <td className="py-4" colSpan="6"><div className="h-4 bg-gray-200 rounded"></div></td>
                  </tr>
                ))
              ) : (
                displayedCashbackRequests.map((request, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-4">{startIndex + index + 1}</td>
                    <td className="py-4">{request.shopName}</td>
                    <td className="py-4">{request.userEmail}</td>
                    <td className="py-4">{request.userName}</td>
                    <td className="py-4">{request.requestedAt}</td>
                    <td className="py-4">
                      <span className="text-[#F59E0B]">{request.status || 'New'}</span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="text-blue-500"
                      >
                        View Details
                      </button>
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
                    className={`w-8 h-8 rounded-sm text-sm ${currentPage === i + 1
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