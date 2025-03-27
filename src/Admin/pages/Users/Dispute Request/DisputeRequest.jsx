import { collection, doc, getDocs, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiMoreVertical, FiFileText, FiX, FiBell } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { db } from "../../../../../firebase";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const DisputeRequest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedDisputeRequest, setSelectedDisputeRequest] = useState(null);
  const [notificationDisputeRequest, setNotificationDisputeRequest] = useState(null);
  const [allDisputeRequest, setAllDisputeRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const itemsPerPage = 5;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(
        collection(db, "cashbackDisputeRequests")
      );
      const data = [];
      querySnapshot.forEach((doc) => {
        const disputeRequestData = doc.data();
        data.push({ id: doc.id, ...disputeRequestData });
      });
      setAllDisputeRequest(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveNotification = async (message, userId) => {
    try {
      await addDoc(collection(db, 'userNotifications'), {
        message,
        userId,
        read: false,
        createdAt: serverTimestamp(),
      });
      console.log("Notification saved successfully");
      toast.success("Notification sent successfully");
    } catch (error) {
      console.error("Error saving notification: ", error);
      toast.error("Failed to send notification");
    }
  };

  const handleSendNotification = async () => {
    if (notificationDisputeRequest) {
      setIsSendingNotification(true);
      try {
        const message = `Your dispute request for ${notificationDisputeRequest.shopName} has been ${notificationDisputeRequest.status.toLowerCase()}.`;
        await saveNotification(message, notificationDisputeRequest.userEmail);
        setNotificationDisputeRequest(null);
      } catch (error) {
        console.error("Error sending notification:", error);
      } finally {
        setIsSendingNotification(false);
      }
    }
  };

  const triggerNotificationPopup = (disputeRequest) => {
    setNotificationDisputeRequest(disputeRequest);
  };

  const filteredDisputeRequests = allDisputeRequest.filter((dispute) => {
    switch (activeTab) {
      case "Pending":
        return dispute.status === "Pending";
      case "Resolved":
        return dispute.status === "Resolved";
      case "Rejected":
        return dispute.status === "Rejected";
      default:
        return false;
    }
  });

  const handleDisputeRejection = async (disputeRequest) => {
    setIsRejecting(true);
    try {
      // Update dispute request status
      const disputeRef = doc(db, "cashbackDisputeRequests", disputeRequest.id);
      await updateDoc(disputeRef, {
        status: "Rejected",
        rejectedAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      // Send rejection email
      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: disputeRequest.userEmail,
        title: "ShoppinessMart - Dispute Request Rejected",
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333; margin-bottom: 20px;">Dispute Request Update</h2>
              
              <p style="color: #666;">Dear ${disputeRequest.userName},</p>
              
              <p style="color: #666;">We have reviewed your dispute request submitted on ${disputeRequest.requestedAt} for the following transaction:</p>
              
              <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>Shop Name:</strong> ${disputeRequest.shopName}</p>
                <p style="margin: 5px 0;"><strong>Paid Amount:</strong> ${disputeRequest.paidAmount}</p>
                <p style="margin: 5px 0;"><strong>Coupon Code:</strong> ${disputeRequest.couponCode}</p>
              </div>

              <p style="color: #666;">Your dispute request has been rejected. This could be due to one or more of the following reasons:</p>
              
              <ul style="color: #666;">
                <li style="margin-bottom: 10px;">The selected shop does not match with the coupon's associated shop</li>
                <li style="margin-bottom: 10px;">The coupon code is incorrect or has expired</li>
                <li style="margin-bottom: 10px;">The transaction amount does not meet the minimum requirement</li>
                <li style="margin-bottom: 10px;">The uploaded invoice does not match the transaction details</li>
                <li style="margin-bottom: 10px;">The full payment has not been made as per the invoice</li>
                <li style="margin-bottom: 10px;">The cashback has already been credited to your wallet</li>
                <li style="margin-bottom: 10px;">The coupon was not activated before making the purchase</li>
              </ul>

              <p style="color: #666;">To ensure successful cashback claims in the future, please:</p>
              <ul style="color: #666;">
                <li>Verify the shop and coupon details before making a purchase</li>
                <li>Ensure the coupon is activated before transaction</li>
                <li>Meet the minimum purchase requirements</li>
                <li>Make full payment as per the invoice</li>
                <li>Keep all transaction receipts for reference</li>
              </ul>

              <p style="color: #666;">If you need clarification or believe this was rejected in error, please contact our support team for assistance.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; margin: 0;">Best regards,</p>
                <p style="color: #666; margin: 5px 0;">The ShoppinessMart Team</p>
              </div>
            </div>
          </div>
        `,
      });

      // Set notification dispute request to trigger popup
      setNotificationDisputeRequest(disputeRequest);

      toast.success("Dispute request rejected successfully");
      setSelectedDisputeRequest(null);
      fetchData();
    } catch (error) {
      console.error("Error rejecting dispute:", error);
      toast.error("Failed to reject dispute request");
    } finally {
      setIsRejecting(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredDisputeRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedDisputeRequests = filteredDisputeRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-[#F59E0B]";
      case "Resolved":
        return "text-[#22C55E]";
      case "Rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (selectedDisputeRequest) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setSelectedDisputeRequest(null)}
            className="flex items-center gap-2 text black hover:text-gray-900"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="text-lg ">Dispute request details</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md border p-8">
          <div className="grid grid-cols-2 gap-y-8">
            <div>
              <div className="text-gray-500 mb-1">Requestor Name</div>
              <div className="font-medium">
                {selectedDisputeRequest.userName}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1"> Requestor Email</div>
              <div className="font-medium">
                {selectedDisputeRequest.userEmail}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Shop Name</div>
              <div className="font-medium">
                {selectedDisputeRequest.shopName}
              </div>
            </div>

            <div>
              <div className="text-gray-500 mb-1"> Shop Email</div>
              <div className="font-medium">
                {selectedDisputeRequest.shopEmail}
              </div>
            </div>

            <div>
              <div className="text-gray-500 mb-1">Paid Amount</div>
              <div className="font-medium">
                {selectedDisputeRequest.paidAmount}
              </div>
            </div>

            <div>
              <div className="text-gray-500 mb-1">Shop Phone No.</div>
              <div className="font-medium">
                {selectedDisputeRequest.shopPhone}
              </div>
            </div>

            <div>
              <div className="text-gray-500 mb-1">Requested Date</div>
              <div className="font-medium">
                {selectedDisputeRequest.requestedAt}
              </div>
            </div>
            {selectedDisputeRequest.status === "Resolved" && (
              <div>
                <div className="text-gray-500 mb-1">Resolved Date</div>
                <div className="font-medium">
                  {selectedDisputeRequest.rejectedAt}
                </div>
              </div>
            )}
            {selectedDisputeRequest.status === "Rejected" && (
              <div>
                <div className="text-gray-500 mb-1">Rejected Date</div>
                <div className="font-medium">
                  {selectedDisputeRequest.rejectedAt}
                </div>
              </div>
            )}
            <div>
              <div className="text-gray-500 mb-1">Invoice</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <FiFileText className="w-5 h-5 text-red-500" />
                  <span>{selectedDisputeRequest.invoiceName}</span>
                </div>
                <Link
                  to={selectedDisputeRequest.invoiceUrl}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  View
                </Link>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-12">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
              onClick={() => handleDisputeRejection(selectedDisputeRequest)}
              disabled={isRejecting}
            >
              {isRejecting ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                "Request Denied"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-normal mb-8">Dispute Requests</h1>

      <div className="bg-white rounded-lg border shadow-lg p-6">
        {/* Notification Popup */}
        {notificationDisputeRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 relative">
              <button
                onClick={() => setNotificationDisputeRequest(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold mb-4">Send Notification</h2>
              <p className="mb-4 text-gray-600">
                Send a notification for dispute request from {notificationDisputeRequest.userName}?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setNotificationDisputeRequest(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  className="px-4 py-2 bg-[#F59E0B] text-white rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {["Pending", "Resolved", "Rejected"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full ${activeTab === tab
                  ? "bg-[#F59E0B] text-white"
                  : "border border-black text-gray-600"
                }`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab} Dispute Requests
            </button>
          ))}
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left font-medium">
                <th className="pb-4 text-gray-500">#</th>
                <th className="pb-4 text-gray-500">Code</th>
                <th className="pb-4 text-gray-500">Shop Name</th>
                <th className="pb-4 text-gray-500">Shop Email</th>
                <th className="pb-4 text-gray-500">User Name</th>
                <th className="pb-4 text-gray-500">Requested Date</th>
                {activeTab === "Resolved" && (
                  <th className="pb-4 text-gray-500">Resolved Date</th>
                )}
                {activeTab === "Rejected" && (
                  <th className="pb-4 text-gray-500">Rejected Date</th>
                )}
                <th className="pb-4 text-gray-500">Status</th>
                <th className="pb-4 text-gray-500">Notification</th>
                <th className="pb-4 text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton loading effect
                [...Array(itemsPerPage)].map((_, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                  </tr>
                ))
              ) : displayedDisputeRequests.length === 0 ? (
                // Empty state message
                <tr>
                  <td
                    colSpan="9"
                    className="py-4 text-center text-gray-500"
                  >
                    No {activeTab.toLowerCase()} dispute requests found.
                  </td>
                </tr>
              ) : (
                displayedDisputeRequests.map((dispute, index) => (
                  <tr key={dispute.id} className="border-t">
                    <td className="py-4">{index + 1}.</td>
                    <td className="py-4">{dispute.couponCode}</td>
                    <td className="py-4">{dispute.shopName}</td>
                    <td className="py-4">{dispute.shopEmail}</td>
                    <td className="py-4">{dispute.userName}</td>
                    <td className="py-4">{dispute.requestedAt}</td>
                    {activeTab === "Resolved" && (
                      <td className="py-4">{dispute.resolvedAt}</td>
                    )}
                    {activeTab === "Rejected" && (
                      <td className="py-4">{dispute.rejectedAt}</td>
                    )}
                    <td className="py-4">
                      <span className={getStatusColor(dispute.status)}>
                        {dispute.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => triggerNotificationPopup(dispute)}
                        className="px-3 py-1 bg-[#F59E0B] text-white rounded flex items-center gap-2 hover:bg-[#D97706] transition-colors"
                      >
                        <FiBell className="w-4 h-4" />
                        Send
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                          <FiMoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="absolute z-99 right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                            onClick={() => setSelectedDisputeRequest(dispute)}
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
            Showing {Math.min(itemsPerPage, filteredDisputeRequests.length)} of{" "}
            {filteredDisputeRequests.length}
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
      </div>
    </div>
  );
};

export default DisputeRequest;