import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { writeBatch } from "firebase/firestore"; 
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../../../firebase";
import {
  BsPerson,
  BsEnvelope,
  BsCurrencyDollar,
  BsBank2,
  BsCalendar,
} from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";
import { BiLoaderAlt } from "react-icons/bi";
const SkeletonRow = () => {
  return (
    <tr className="border-b animate-pulse">
      <td className="py-4">
        <div className="h-4 w-8 bg-gray-200 rounded"></div>
      </td>
      <td className="py-4">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
      </td>
      <td className="py-4">
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </td>
      <td className="py-4">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </td>
      <td className="py-4">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </td>
      <td className="py-4">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </td>
      <td className="py-4">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </td>
      <td className="py-4">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </td>
    </tr>
  );
};

const SkeletonDetails = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="p-3 bg-gray-200 rounded-lg w-12 h-12"></div>
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
      <div className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
        <div className="p-3 bg-gray-200 rounded-lg w-12 h-12"></div>
        <div className="flex-1">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-44 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Givebacks = () => {
  const [activeTab, setActiveTab] = useState("requested");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [history, setHistory] = useState([]);
  const [ngoDetails, setNgoDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ngoLoading, setNgoLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedGivebackRequest, setSelectedGivebackRequest] = useState(null);
  const itemsPerPage = 5;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "givebackCashbacks"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const GivebackHistoryData = doc.data();
        data.push({ historyId: doc.id, ...GivebackHistoryData });
      });
      setHistory(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateString) => {
    return dateString.split("T")[0];
  };

  const sortDonations = (donations) => {
    switch (sortBy) {
      case "newest":
        return [...donations].sort(
          (a, b) =>
            new Date(formatDate(b.requestedAt)) -
            new Date(formatDate(a.requestedAt))
        );
      case "oldest":
        return [...donations].sort(
          (a, b) =>
            new Date(formatDate(a.requestedAt)) -
            new Date(formatDate(b.requestedAt))
        );
      case "az":
        return [...donations].sort((a, b) =>
          a.ngoName.localeCompare(b.ngoName)
        );
      case "za":
        return [...donations].sort((a, b) =>
          b.ngoName.localeCompare(a.ngoName)
        );
      default:
        return donations;
    }
  };

  const filteredGiveBackRequest = history.filter((coupon) =>
    activeTab === "requested"
      ? coupon.status === "Pending"
      : coupon.status === "Completed"
  );

  const sortedDonations = sortDonations(filteredGiveBackRequest);
  const totalPages = Math.ceil(filteredGiveBackRequest.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedDonations = sortedDonations.slice(
    startIndex,
    startIndex + itemsPerPage
  );
 

  const handleMarkAsPaid = async (givebackRequest) => {
    setIsProcessingPayment(true);
    try {
      // Create a Firestore batch
      const batch = writeBatch(db);
  
      // 1. Update NGO's total donation amount and total givebacks
      const ngoRef = doc(db, "causeDetails", givebackRequest.ngoId);
      const ngoDoc = await getDoc(ngoRef);
      if (!ngoDoc.exists()) {
        throw new Error("NGO document not found");
      }
      const ngoData = ngoDoc.data();
  
      batch.update(ngoRef, {
        totalDonationAmount: (ngoData.totalDonationAmount || 0) + givebackRequest.amount,
        totalGiveBacks: (ngoData.totalGiveBacks || 0) + 1,
      });
  
      // 2. Update user's pending giveback amount and giveback amount
      const userRef = doc(db, "users", givebackRequest.userId);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        throw new Error("User document not found");
      }
  
      const userData = userDoc.data();
  
      batch.update(userRef, {
        pendingGivebackAmount: Math.max(0, (userData.pendingGivebackAmount || 0) - givebackRequest.amount),
        givebackAmount: (userData.givebackAmount || 0) + givebackRequest.amount,
      });
  
      // 3. Update the giveback request status to "Completed"
      const withdrawalRef = doc(db, "givebackCashbacks", givebackRequest.historyId);
      batch.update(withdrawalRef, {
        status: "Completed",
        paidAt: new Date().toISOString(),
      });
  
      // Commit the batch (all updates happen atomically)
      await batch.commit();
  
      // 4. Refresh the giveback requests list
      await fetchData();
  
      // 5. Reset selected giveback request and show success message
      setSelectedGivebackRequest(null);
      toast.success("Payment marked as completed successfully!");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };
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
      { key: "ngo", label: "NGO/Cause name" },
      { key: "email", label: "Email" },
      { key: "name", label: "Donor Name" },
      { key: "requestDate", label: "Request Date" },
      { key: "amount", label: "Donated Amount" },
      { key: "status", label: "Status" },
      { key: "action", label: "Action" },
    ];

    if (activeTab === "Completed") {
      // Insert paid date header before status for collected withdrawals
      commonHeaders.splice(6, 0, { key: "paidDate", label: "Paid Date" });
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
        <td colSpan={activeTab === "Collected" ? 9 : 8} className="py-8">
          <div className="text-center text-gray-500">
            {activeTab === "Pending" ? (
              <p className="text-lg">
                No pending giveback requests at the moment.
              </p>
            ) : (
              <p className="text-lg">No completed givebacks to display yet.</p>
            )}
          </div>
        </td>
      </tr>
    );
  };
  // Update the table rows rendering
  const renderTableRows = () => {
    if (loading) {
      return [Array.from({ length: itemsPerPage })].map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }
    return displayedDonations.length > 0
      ? displayedDonations.map((donation, index) => (
          <tr key={index} className="border-t">
            <td className="py-4">{startIndex + index + 1}.</td>
            <td className="py-4">{donation.ngoName}</td>
            <td className="py-4">{donation.userEmail}</td>
            <td className="py-4">{donation.userName}</td>
            <td className="py-4">{formatDate(donation.requestedAt)}</td>
            <td className="py-4">₹{donation.amount}</td>
            {activeTab === "Completed" && (
              <td className="py-4">{formatDate(donation.paidAt)}</td>
            )}
            <td
              className={`py-4 font-medium ${getStatusColor(donation.status)}`}
            >
              {donation.status}
            </td>
            <td className="py-4">
              <button
                onClick={() => setSelectedGivebackRequest(donation)}
                className="border px-2 py-1 border-[#F59E0B] hover:bg-[#F59E0B] hover:text-white transition-colors duration-200"
              >
                View Details
              </button>
            </td>
          </tr>
        ))
      : renderEmptyMessage();
  };
  useEffect(() => {
    if (selectedGivebackRequest) {
      const fetchNgoDetails = async () => {
        setNgoLoading(true);
        try {
          const docRef = doc(db, "causeDetails", selectedGivebackRequest.ngoId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setNgoDetails(data);
          }
        } catch (error) {
          console.error("Error fetching NGO details:", error);
          toast.error("Failed to load NGO details");
        } finally {
          setNgoLoading(false);
        }
      };

      fetchNgoDetails();
    }
  }, [selectedGivebackRequest]);

  if (selectedGivebackRequest) {
    const { paymentDetails } = ngoDetails || {};

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div>
          {/* Header */}
          <button
            onClick={() => setSelectedGivebackRequest(null)}
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
            aria-label="Go back"
          >
            <IoArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xl font-medium">
              Giveback Request Details
            </span>
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-6">
              <h2 className="text-white text-2xl font-semibold">
                Request ID: # {selectedGivebackRequest.historyId}
              </h2>
            </div>

            {/* Card Content */}
            <div className="p-8">
              {ngoLoading ? (
                <SkeletonDetails />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-violet-50 rounded-lg">
                      <BsPerson className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Doner Name
                      </div>
                      <div className="font-medium text-gray-900">
                        {selectedGivebackRequest.userName}
                      </div>
                    </div>
                  </div>

                  {/* NGO Name */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-violet-50 rounded-lg">
                      <BsPerson className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">NGO Name</div>
                      <div className="font-medium text-gray-900">
                        {ngoDetails?.causeName || "N/A"}
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
                        {selectedGivebackRequest.userEmail}
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
                        {selectedGivebackRequest.amount}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <BsBank2 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Payment Method
                      </div>
                      {paymentDetails?.bankAccounts?.length > 0 ? (
                        <div className="font-medium text-gray-900 space-y-1">
                          <div className="text-sm text-gray-600">
                            Account Name:{" "}
                            {paymentDetails.bankAccounts[0].accountName}
                          </div>
                          <div className="text-sm text-gray-600">
                            IFSC Code: {paymentDetails.bankAccounts[0].ifscCode}
                          </div>
                          <div className="text-sm text-gray-600">
                            Account Number:{" "}
                            {paymentDetails.bankAccounts[0].accountNumber}
                          </div>
                        </div>
                      ) : paymentDetails?.upiDetails?.length > 0 ? (
                        <div className="font-medium text-sm text-gray-600">
                          UPI ID: {paymentDetails.upiDetails[0].upiId}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          No payment details available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Requested Date */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <BsCalendar className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Requested Date
                      </div>
                      <div className="font-medium text-gray-900">
                        {formatDate(selectedGivebackRequest.requestedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Paid Date (if applicable) */}
                  {activeTab === "Completed" && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <BsCalendar className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Paid Date
                        </div>
                        <div className="font-medium text-gray-900">
                          {formatDate(selectedGivebackRequest.paidAt)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {renderActionButtons(selectedGivebackRequest)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  const getStatusColor = (status) => {
    return status === "Completed" ? "text-emerald-500" : "text-[#F59E0B]";
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl">Give Backs</h1>
        </div>
        <div className="relative">
          <select
            className="appearance-none border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Alphabetical (A-Z)</option>
            <option value="za">Alphabetical (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "requested"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("requested");
              setCurrentPage(1);
            }}
          >
            Pending Givebacks
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "Completed"
                ? "bg-[#F59E0B] text-white"
                : "border border-black text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("Completed");
              setCurrentPage(1);
            }}
          >
            Completed Givebacks
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>{renderTableHeaders()}</thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>

        <div className="py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(
              startIndex + itemsPerPage,
              filteredGiveBackRequest.length
            )}{" "}
            of {filteredGiveBackRequest.length}
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
                className={`w-8 h-8 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
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

export default Givebacks;
