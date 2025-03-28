import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import {
  BsPerson,
  BsEnvelope,
  BsCurrencyDollar,
  BsBank2,
  BsCalendar,
} from "react-icons/bs";
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
        <div className="flex justify-end mt-12 border-t pt-8">
          <button
            onClick={() => handleMarkAsPaid(request)}
            disabled={isProcessingPayment}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium
                      hover:from-amber-600 hover:to-orange-600 transition-all duration-200 
                      focus:ring-4 focus:ring-amber-200 focus:outline-none
                      active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                      flex items-center gap-2"
          >
            {isProcessingPayment ? (
              <>
                <BiLoaderAlt className="w-5 h-5 animate-spin" />
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

    return (
      <tr>
        <td colSpan={activeTab === "Collected" ? 8 : 7} className="py-8">
          <div className="text-center text-gray-500">
            {activeTab === "Pending" ? (
              <p className="text-lg">
                No pending withdrawal requests at the moment.
              </p>
            ) : (
              <p className="text-lg">
                No completed withdrawals to display yet.
              </p>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const getStatusColor = (status) => {
    return status === "Collected" ? "text-emerald-500" : "text-[#F59E0B]";
  };

  // Update the table rows rendering
  const renderTableRows = () => {
    return displayedWithdraws.length > 0
      ? displayedWithdraws.map((withdraw, index) => (
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
      ))
      : renderEmptyMessage();
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

  if (selectedWithdrawalRequest) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div>
          {/* Header */}
          <button
            onClick={() => setSelectedWithdrawalRequest(null)}
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
            aria-label="Go back"
          >
            <IoArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xl font-medium">
              Withdrawal Request Details
            </span>
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-6">
              <h2 className="text-white text-2xl font-semibold">
                Request ID: # {selectedWithdrawalRequest.paymentId}
              </h2>
            </div>

            {/* Card Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-50 rounded-lg">
                    <BsPerson className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Name</div>
                    <div className="font-medium text-gray-900">
                      {selectedWithdrawalRequest.userName}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <BsEnvelope className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <div className="font-medium text-gray-900">
                      {selectedWithdrawalRequest.userEmail}
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <BsCurrencyDollar className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Requested Amount
                    </div>
                    <div className="font-medium text-gray-900">
                      {selectedWithdrawalRequest.amount}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <BsBank2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Payment Method
                    </div>
                    <div className="font-medium text-gray-900 mb-2">
                      {selectedWithdrawalRequest.selectedPayment?.type ===
                        "bank"
                        ? "Bank Transfer"
                        : "UPI Payment"}
                    </div>
                    {selectedWithdrawalRequest.selectedPayment?.type ===
                      "bank" ? (
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          {selectedWithdrawalRequest.selectedPayment?.bankName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {
                            selectedWithdrawalRequest.selectedPayment
                              ?.accountNumber
                          }
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedWithdrawalRequest.selectedPayment?.ifscCode}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        {selectedWithdrawalRequest.selectedPayment?.upiId}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <BsCalendar className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Requested Date
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatDate(selectedWithdrawalRequest.requestedAt)}
                    </div>
                  </div>
                </div>
                {activeTab === "Collected" && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <BsCalendar className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Paid Date
                      </div>
                      <div className="font-medium text-gray-900">
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
    <div className="p-6">
      <h1 className="text-2xl font-normal mb-8">Withdrawal Requests</h1>
      <div className="bg-white rounded-lg border shadow-lg p-6">
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "Pending"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
              }`}
            onClick={() => setActiveTab("Pending")}
          >
            Pending Withdrawals
          </button>
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "Collected"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
              }`}
            onClick={() => setActiveTab("Collected")}
          >
            Paid Withdrawals
          </button>
        </div>
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
          <p className="text-center text-gray-500">
            No withdrawal requests have been made.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>{renderTableHeaders()}</thead>
              <tbody>{renderTableRows()}</tbody>
            </table>
          </div>
        )}
        {filteredWithdraws.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {Math.min(itemsPerPage, filteredWithdraws.length)} of{" "}
              {filteredWithdraws.length}
            </div>
            <div className="flex items-center gap-2">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalRequests;