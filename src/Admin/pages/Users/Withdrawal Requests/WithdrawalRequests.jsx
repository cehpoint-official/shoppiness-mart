import { collection, doc, getDoc, getDocs, updateDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { BsPerson, BsEnvelope, BsCurrencyDollar, BsBank2, BsCalendar } from "react-icons/bs";
import { BiLoaderAlt } from "react-icons/bi";
import { db } from "../../../../../firebase";
import toast from "react-hot-toast";

const WithdrawalRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Pending");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedWithdrawalRequest, setSelectedWithdrawalRequest] = useState(null);
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener("resize", checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "WithdrawCashback"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const withdrawsData = doc.data();
        data.push({ paymentId: doc.id, ...withdrawsData });
      });
      setWithdraws(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkAsPaid = async (withdrawalRequest) => {
    setIsProcessingPayment(true);
    try {
      // References to documents
      const userRef = doc(db, "users", withdrawalRequest.userId);
      const withdrawalRef = doc(db, "WithdrawCashback", withdrawalRequest.paymentId);
      const userNotificationRef = doc(collection(db, "userNotifications"));
  
      // Get user document
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        throw new Error("User document not found");
      }
  
      const userData = userDoc.data();
      const currentTime = new Date().toISOString();
  
      // 1. Update withdrawal request status
      await updateDoc(withdrawalRef, {
        status: "Collected",
        paidAt: currentTime,
      });
  
      // 2. Update user's cashback balances
      await updateDoc(userRef, {
        pendingCashback: Math.max(0, (userData.pendingCashback || 0) - withdrawalRequest.amount),
        withdrawAmount: (userData.withdrawAmount || 0) + withdrawalRequest.amount,
      });
  
      // 3. Add user notification
      await setDoc(userNotificationRef, {
        message: `Great news! Your withdrawal request of ₹${withdrawalRequest.amount} has been processed and paid.`,
        userId: userData.email,
        read: false,
        createdAt: currentTime,
      });
  
      // 4. Refresh the withdrawals list
      await fetchData();
  
      // 5. Reset selected withdrawal request and show success message
      setSelectedWithdrawalRequest(null);
      toast.success("Payment marked as completed successfully!");
  
    } catch (error) {
      console.error("Error processing payment and notifications:", error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Update the action buttons section in the detail view
  const renderActionButtons = (request) => {
    if (request.status === "Pending") {
      return (
        <div className="flex justify-end mt-6 md:mt-12 border-t pt-4 md:pt-8">
          <button
            onClick={() => handleMarkAsPaid(request)}
            disabled={isProcessingPayment}
            className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium
                      hover:from-amber-600 hover:to-orange-600 transition-all duration-200 
                      focus:ring-4 focus:ring-amber-200 focus:outline-none
                      active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                      flex items-center gap-2 text-sm md:text-base"
          >
            {isProcessingPayment ? (
              <>
                <BiLoaderAlt className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Mark as Paid"
            )}
          </button>
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "";
    return dateString.split("T")[0];
  };

  const filteredWithdraws = withdraws.filter((withdraw) =>
    activeTab === "Pending"
      ? withdraw.status === "Pending"
      : withdraw.status === "Collected"
  );

  const totalPages = Math.ceil(filteredWithdraws.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedWithdraws = filteredWithdraws.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Render mobile card for each withdrawal request
  const renderMobileCard = (withdraw, index) => (
    <div key={withdraw.paymentId} className="bg-white p-4 rounded-lg shadow-sm mb-4 border">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium">{`${startIndex + index + 1})`}</span>
        <span className={`text-sm font-medium ${getStatusColor(withdraw.status)}`}>
          {withdraw.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm mb-3">
        <div className="flex flex-col">
          <span className="text-gray-500">Email:</span>
          <span className="font-medium text-right break-all truncate">{withdraw.userEmail}</span>
        </div>
        <div className="flex items-stretch gap-x-2">
          <span className="text-gray-500">Name:</span>
          <span>{withdraw.userName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Amount:</span>
          <span>{withdraw.amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payment:</span>
          <span className="uppercase">{withdraw.selectedPayment?.type || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Requested:</span>
          <span>{formatDate(withdraw.requestedAt)}</span>
        </div>
        {activeTab === "Collected" && (
          <div className="flex justify-between">
            <span className="text-gray-500">Paid Date:</span>
            <span>{formatDate(withdraw.paidAt)}</span>
          </div>
        )}
      </div>
      
      <button
        onClick={() => setSelectedWithdrawalRequest(withdraw)}
        className="w-full border px-2 py-1.5 border-[#F59E0B] hover:bg-[#F59E0B] hover:text-white transition-colors duration-200 text-center mt-2"
      >
        View Details
      </button>
    </div>
  );

  const getStatusColor = (status) => {
    return status === "Collected" ? "text-emerald-500" : "text-[#F59E0B]";
  };

  const renderTableHeaders = () => {
    const commonHeaders = [
      { key: "number", label: "#" },
      { key: "email", label: "Email" },
      { key: "name", label: "Name" },
      { key: "requestDate", label: "Request Date" },
      { key: "amount", label: "Requested Amount" },
      { key: "paymentType", label: "Payment Type" },
      { key: "status", label: "Status" },
      { key: "action", label: "Action" },
    ];

    if (activeTab === "Collected") {
      // Insert paid date header before action column
      commonHeaders.splice(7, 0, { key: "paidDate", label: "Paid Date" });
    }

    return (
      <tr className="text-left font-medium">
        {commonHeaders.map((header) => (
          <th key={header.key} className="pb-4 text-gray-500">
            {header.label}
          </th>
        ))}
      </tr>
    );
  };

  const renderEmptyMessage = () => {
    if (loading) return null;

    return activeTab === "Pending" ? (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">No pending withdrawal requests at the moment.</p>
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">No completed withdrawals to display yet.</p>
      </div>
    );
  };

  // Update the table rows rendering
  const renderTableRows = () => {
    return displayedWithdraws.map((withdraw, index) => (
      <tr key={withdraw.paymentId} className="border-t">
        <td className="py-4">{startIndex + index + 1}.</td>
        <td className="py-4">{withdraw.userEmail}</td>
        <td className="py-4">{withdraw.userName}</td>
        <td className="py-4">{formatDate(withdraw.requestedAt)}</td>
        <td className="py-4">{withdraw.amount}</td>
        <td className="py-4 uppercase">
          {withdraw.selectedPayment?.type || "N/A"}
        </td>
        {activeTab === "Collected" && (
          <td className="py-4">{formatDate(withdraw.paidAt)}</td>
        )}
        <td
          className={`py-4 font-medium ${getStatusColor(withdraw.status)}`}
        >
          {withdraw.status}
        </td>
        <td className="py-4">
          <button
            onClick={() => setSelectedWithdrawalRequest(withdraw)}
            className="border px-2 py-1 border-[#F59E0B] hover:bg-[#F59E0B] hover:text-white transition-colors duration-200"
          >
            View Details
          </button>
        </td>
      </tr>
    ));
  };

  // Detail view
  if (selectedWithdrawalRequest) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 md:p-8">
        <div>
          {/* Header */}
          <button
            onClick={() => setSelectedWithdrawalRequest(null)}
            className="flex items-center gap-2 md:gap-3 text-gray-600 hover:text-gray-900 transition-colors mb-4 md:mb-8 group"
            aria-label="Go back"
          >
            <IoArrowBack className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg md:text-xl font-medium">
              Withdrawal Request Details
            </span>
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4 md:p-6">
              <h2 className="text-white text-lg md:text-2xl font-semibold break-words">
                Request ID: # {selectedWithdrawalRequest.paymentId}
              </h2>
            </div>

            {/* Card Content */}
            <div className="p-4 md:p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                {/* Name */}
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-violet-50 rounded-lg">
                    <BsPerson className="w-4 h-4 md:w-5 md:h-5 text-violet-500" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-500 mb-1">Name</div>
                    <div className="font-medium text-sm md:text-base text-gray-900">
                      {selectedWithdrawalRequest.userName}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-purple-50 rounded-lg">
                    <BsEnvelope className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-500 mb-1">Email</div>
                    <div className="font-medium text-sm md:text-base text-gray-900 whitespace-normal break-all">
                      {selectedWithdrawalRequest.userEmail}
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-emerald-50 rounded-lg">
                    <BsCurrencyDollar className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-500 mb-1">
                      Requested Amount
                    </div>
                    <div className="font-medium text-sm md:text-base text-gray-900">
                      {selectedWithdrawalRequest.amount}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                    <BsBank2 className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-500 mb-1">
                      Payment Method
                    </div>
                    <div className="font-medium text-sm md:text-base text-gray-900 mb-2">
                      {selectedWithdrawalRequest.selectedPayment?.type ===
                        "bank"
                        ? "Bank Transfer"
                        : "UPI Payment"}
                    </div>
                    {selectedWithdrawalRequest.selectedPayment?.type ===
                      "bank" ? (
                      <div className="space-y-1">
                        <div className="text-xs md:text-sm text-gray-600">
                          {selectedWithdrawalRequest.selectedPayment?.bankName}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 break-words">
                          {
                            selectedWithdrawalRequest.selectedPayment
                              ?.accountNumber
                          }
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          {selectedWithdrawalRequest.selectedPayment?.ifscCode}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs md:text-sm text-gray-600 break-words">
                        {selectedWithdrawalRequest.selectedPayment?.upiId}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-amber-50 rounded-lg">
                    <BsCalendar className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-500 mb-1">
                      Requested Date
                    </div>
                    <div className="font-medium text-sm md:text-base text-gray-900">
                      {formatDate(selectedWithdrawalRequest.requestedAt)}
                    </div>
                  </div>
                </div>
                {selectedWithdrawalRequest.status === "Collected" && (
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                      <BsCalendar className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-gray-500 mb-1">
                        Paid Date
                      </div>
                      <div className="font-medium text-sm md:text-base text-gray-900">
                        {formatDate(selectedWithdrawalRequest.paidAt)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {renderActionButtons(selectedWithdrawalRequest)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <h1 className="text-xl md:text-2xl font-normal mb-4 md:mb-8">Withdrawal Requests</h1>
      <div className="bg-white rounded-lg border shadow-lg p-3 md:p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-8">
          <button
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base flex-grow md:flex-grow-0 ${
              activeTab === "Pending"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("Pending");
              setCurrentPage(1);
            }}
          >
            Pending Withdrawals
          </button>
          <button
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base flex-grow md:flex-grow-0 ${
              activeTab === "Collected"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("Collected");
              setCurrentPage(1);
            }}
          >
            Paid Withdrawals
          </button>
        </div>
        
        {/* Content */}
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-full mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-6 bg-gray-200 rounded w-full mb-2"
              ></div>
            ))}
          </div>
        ) : filteredWithdraws.length === 0 ? (
          renderEmptyMessage()
        ) : isMobile ? (
          // Mobile card view
          <div className="space-y-2">
            {displayedWithdraws.map((withdraw, index) => 
              renderMobileCard(withdraw, index)
            )}
          </div>
        ) : (
          // Desktop table view
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>{renderTableHeaders()}</thead>
              <tbody>{renderTableRows()}</tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {filteredWithdraws.length > 0 && (
          <div className="mt-6 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="text-xs md:text-sm text-gray-500 order-2 md:order-1">
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredWithdraws.length)} of {filteredWithdraws.length}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2 order-1 md:order-2">
              <button
                className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>
              
              {totalPages <= 3 ? (
                // Show all pages if 3 or fewer
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
                // Very compact pagination for mobile
                <>
                  {/* Always show first page */}
                  <button
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-sm text-xs md:text-sm ${
                      currentPage === 1 ? "bg-[#F59E0B] text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </button>
                  
                  {/* Show ellipsis if current page is more than 2 */}
                  {currentPage > 2 && <span className="text-gray-500 text-xs">...</span>}
                  
                  {/* Show current page if not first or last */}
                  {currentPage !== 1 && currentPage !== totalPages && (
                    <button
                      className="w-6 h-6 md:w-8 md:h-8 rounded-sm text-xs md:text-sm bg-[#F59E0B] text-white"
                    >
                      {currentPage}
                    </button>
                  )}
                  
                  {/* Show ellipsis if current page is less than totalPages - 1 */}
                  {currentPage < totalPages - 1 && <span className="text-gray-500 text-xs">...</span>}
                  
                  {/* Always show last page */}
                  {totalPages > 1 && (
                    <button
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-sm text-xs md:text-sm ${
                        currentPage === totalPages ? "bg-[#F59E0B] text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                </>
              )}
              
              <button
                className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalRequests;