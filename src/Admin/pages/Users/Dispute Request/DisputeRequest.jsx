import { collection, doc, getDocs, updateDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiMoreVertical, FiFileText } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { db } from "../../../../../firebase";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const DisputeRequest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedDisputeRequest, setSelectedDisputeRequest] = useState(null);
  const [allDisputeRequest, setAllDisputeRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRejecting, setIsRejecting] = useState(false);
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

      // Create a user notification
      const userNotificationRef = doc(collection(db, "userNotifications"));
      const currentTime = new Date().toISOString();

      await setDoc(userNotificationRef, {
        message: `We regret to inform you that your dispute request for ${disputeRequest.shopName} has been rejected.`,
        userId: disputeRequest.userEmail,
        read: false,
        createdAt: currentTime,
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

  // Card component for mobile view
  const DisputeCard = ({ dispute, index }) => (
    <div className="bg-white p-4 rounded-md shadow mb-4 border">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-sm">#{index + 1}</span>
        <span className={`${getStatusColor(dispute.status)} text-sm font-medium`}>
          {dispute.status}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <div className="text-gray-500 text-xs">Code</div>
          <div className="font-medium text-sm">{dispute.couponCode}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Shop Name</div>
          <div className="font-medium text-sm">{dispute.shopName}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">User Name</div>
          <div className="font-medium text-sm">{dispute.userName}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Requested Date</div>
          <div className="font-medium text-sm">{dispute.requestedAt}</div>
        </div>
        {activeTab === "Resolved" && (
          <div>
            <div className="text-gray-500 text-xs">Resolved Date</div>
            <div className="font-medium text-sm">{dispute.resolvedAt}</div>
          </div>
        )}
        {activeTab === "Rejected" && (
          <div>
            <div className="text-gray-500 text-xs">Rejected Date</div>
            <div className="font-medium text-sm">{dispute.rejectedAt}</div>
          </div>
        )}
      </div>

      <button
        onClick={() => setSelectedDisputeRequest(dispute)}
        className="w-full bg-blue-50 text-blue-600 py-2 rounded text-sm"
      >
        View Details
      </button>
    </div>
  );

  if (selectedDisputeRequest) {
    return (
      <div className="p-3 md:p-6">
        <div className="flex items-center gap-2 mb-4 md:mb-8">
          <button
            onClick={() => setSelectedDisputeRequest(null)}
            className="flex items-center gap-2 text-black hover:text-gray-900"
          >
            <FiArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-base md:text-lg">Dispute request details</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md border p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-8">
            <div>
              <div className="text-gray-500 mb-1 text-sm">Requestor Name</div>
              <div className="font-medium">
                {selectedDisputeRequest.userName}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1 text-sm">Requestor Email</div>
              <div className="font-medium text-sm md:text-base break-words">
                {selectedDisputeRequest.userEmail}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1 text-sm">Shop Name</div>
              <div className="font-medium">
                {selectedDisputeRequest.shopName}
              </div>
            </div>

            <div>
              <div className="text-gray-500 mb-1 text-sm">Shop Email</div>
              <div className="font-medium text-sm md:text-base break-words">
                {selectedDisputeRequest.shopEmail}
              </div>
            </div>

            <div>
              <div className="text-gray-500 mb-1 text-sm">Paid Amount</div>
              <div className="font-medium">
                {selectedDisputeRequest.paidAmount}
              </div>
            </div>

            <div>
              <div className="text-gray-500 mb-1 text-sm">Shop Phone No.</div>
              <div className="font-medium">
                {selectedDisputeRequest.shopPhone}
              </div>
            </div>

            <div>
              <div className="text-gray-500 mb-1 text-sm">Requested Date</div>
              <div className="font-medium">
                {selectedDisputeRequest.requestedAt}
              </div>
            </div>
            {selectedDisputeRequest.status === "Resolved" && (
              <div>
                <div className="text-gray-500 mb-1 text-sm">Resolved Date</div>
                <div className="font-medium">
                  {selectedDisputeRequest.resolvedAt}
                </div>
              </div>
            )}
            {selectedDisputeRequest.status === "Rejected" && (
              <div>
                <div className="text-gray-500 mb-1 text-sm">Rejected Date</div>
                <div className="font-medium">
                  {selectedDisputeRequest.rejectedAt}
                </div>
              </div>
            )}
            <div className="md:col-span-2">
              <div className="text-gray-500 mb-1 text-sm">Invoice</div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded flex-1 md:flex-none overflow-hidden">
                  <FiFileText className="w-5 h-5 min-w-5 text-red-500" />
                  <span className="truncate">{selectedDisputeRequest.invoiceName}</span>
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

          <div className="flex justify-end gap-4 mt-6 md:mt-12">
            <button
              className="w-full md:w-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center text-sm"
              onClick={() => handleDisputeRejection(selectedDisputeRequest)}
              disabled={isRejecting}
            >
              {isRejecting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </>
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
    <div className="p-3 md:p-6">
      <h1 className="text-xl md:text-2xl font-normal mb-4 md:mb-8">Dispute Requests</h1>

      <div className="bg-white rounded-lg border shadow-lg p-3 md:p-6">
        {/* Tabs - scrollable on mobile */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
          {["Pending", "Resolved", "Rejected"].map((tab) => (
            <button
              key={tab}
              className={`px-3 md:px-4 py-2 rounded-full text-sm w-full md:w-auto mb-2 md:mb-0 ${activeTab === tab
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

        {/* Desktop Table View - hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
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
                    <td className="py-4">{startIndex + index + 1}</td>
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
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                          <FiMoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="absolute z-10 right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
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

        {/* Mobile Card View */}
        <div className="md:hidden">
          {loading ? (
            // Mobile skeleton loading
            [...Array(itemsPerPage)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white p-4 rounded-md shadow mb-4 border">
                <div className="flex justify-between mb-3">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-3 mb-3">
                  <div>
                    <div className="h-3 w-12 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-3 w-14 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-8 w-full bg-gray-200 rounded"></div>
              </div>
            ))
          ) : displayedDisputeRequests.length === 0 ? (
            // Empty state for mobile
            <div className="bg-white p-8 rounded-md text-center text-gray-500">
              No {activeTab.toLowerCase()} dispute requests found.
            </div>
          ) : (
            // Mobile cards
            displayedDisputeRequests.map((dispute, index) => (
              <DisputeCard key={dispute.id} dispute={dispute} index={startIndex + index} />
            ))
          )}
        </div>

        {/* Pagination - modified for mobile */}
        {(displayedDisputeRequests.length > 0 || !loading) && (
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs md:text-sm text-gray-500 order-2 md:order-1">
              Showing {Math.min(itemsPerPage, filteredDisputeRequests.length)} of{" "}
              {filteredDisputeRequests.length}
            </div>
            <div className="flex items-center gap-2 order-1 md:order-2">
              <button
                className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              {/* Mobile pagination - just show current/total */}
              <span className="md:hidden text-sm mx-2">
                {currentPage} / {totalPages || 1}
              </span>

              {/* Desktop pagination - show all page numbers */}
              <div className="hidden md:flex">
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
              </div>

              <button
                className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm disabled:opacity-50"
                disabled={currentPage === totalPages || totalPages === 0}
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

export default DisputeRequest;