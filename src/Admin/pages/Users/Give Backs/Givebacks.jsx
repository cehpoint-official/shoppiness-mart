import { collection, getDocs, doc, getDoc, writeBatch } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../../../firebase";
import { BsPerson, BsEnvelope, BsCurrencyDollar, BsBank2, BsCalendar } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";
import { BiLoaderAlt } from "react-icons/bi";

const SkeletonRow = () => {
  return (
    <tr className="border-b animate-pulse hidden md:table-row">
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

const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg p-4 shadow mb-4 md:hidden">
      <div className="flex justify-between mb-3">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-5 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const SkeletonDetails = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 animate-pulse">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="flex items-start gap-3 md:gap-4">
          <div className="p-3 bg-gray-200 rounded-lg w-10 h-10 md:w-12 md:h-12"></div>
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-5 md:h-6 w-40 md:w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
      <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 border rounded-lg bg-gray-50">
        <div className="p-3 bg-gray-200 rounded-lg w-10 h-10 md:w-12 md:h-12"></div>
        <div className="flex-1">
          <div className="h-4 w-28 md:w-32 bg-gray-200 rounded mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 w-40 md:w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-36 md:w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 md:w-44 bg-gray-200 rounded"></div>
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
    const batch = writeBatch(db);

    try {
      // References to documents
      const ngoRef = doc(db, "causeDetails", givebackRequest.ngoId);
      const userRef = doc(db, "users", givebackRequest.userId);
      const withdrawalRef = doc(db, "givebackCashbacks", givebackRequest.historyId);
      const ngoNotificationRef = doc(collection(db, "ngoNotifications"));
      const userNotificationRef = doc(collection(db, "userNotifications"));

      // Get required data
      const [ngoDoc, userDoc] = await Promise.all([
        getDoc(ngoRef),
        getDoc(userRef)
      ]);

      if (!ngoDoc.exists() || !userDoc.exists()) {
        throw new Error("Required document not found");
      }

      const ngoData = ngoDoc.data();
      const userData = userDoc.data();

      // 1. Update NGO totals
      batch.update(ngoRef, {
        totalDonationAmount: (ngoData.totalDonationAmount || 0) + givebackRequest.amount,
        totalGiveBacks: (ngoData.totalGiveBacks || 0) + 1,
      });

      // 2. Update user amounts
      batch.update(userRef, {
        pendingGivebackAmount: Math.max(0, (userData.pendingGivebackAmount || 0) - givebackRequest.amount),
        givebackAmount: (userData.givebackAmount || 0) + givebackRequest.amount,
      });

      // 3. Update giveback request status
      const currentTime = new Date().toISOString();
      batch.update(withdrawalRef, {
        status: "Completed",
        paidAt: currentTime,
      });

      // 4. Add NGO notification
      batch.set(ngoNotificationRef, {
        message: `A donation of ₹${givebackRequest.amount} has been successfully made by ${userData.fname} ${userData.lname}.`,
        ngoId: givebackRequest.ngoId,
        read: false,
        createdAt: currentTime,
      });

      // 5. Add user notification
      batch.set(userNotificationRef, {
        message: `Great news! Your giveback request for ${givebackRequest.ngoName} has been processed and paid.`,
        userId: userData.email,
        read: false,
        createdAt: currentTime,
      });

      // Commit all operations atomically
      await batch.commit();

      // Refresh data and show success
      await fetchData();
      setSelectedGivebackRequest(null);
      toast.success("Payment marked as completed successfully!");

    } catch (error) {
      console.error("Error processing payment and notifications:", error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const renderActionButtons = (request) => {
    if (request.status === "Pending") {
      return (
        <div className="flex justify-end mt-8 md:mt-12 border-t pt-4 md:pt-8">
          <button
            onClick={() => handleMarkAsPaid(request)}
            disabled={isProcessingPayment}
            className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium
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
      <tr className="text-left font-medium hidden md:table-row">
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
      <>
        {/* For desktop */}
        <tr className="hidden md:table-row">
          <td colSpan={activeTab === "Completed" ? 9 : 8} className="py-8">
            <div className="text-center text-gray-500">
              {activeTab === "requested" ? (
                <p className="text-lg">
                  No pending giveback requests at the moment.
                </p>
              ) : (
                <p className="text-lg">No completed givebacks to display yet.</p>
              )}
            </div>
          </td>
        </tr>

        {/* For mobile */}
        <div className="md:hidden p-4 text-center text-gray-500 bg-white rounded-lg shadow">
          {activeTab === "requested" ? (
            <p className="text-base">
              No pending giveback requests at the moment.
            </p>
          ) : (
            <p className="text-base">No completed givebacks to display yet.</p>
          )}
        </div>
      </>
    );
  };

  // Render mobile card for each donation
  const renderCard = (donation, index) => {
    const getStatusColor = (status) => {
      return status === "Completed" ? "text-emerald-500" : "text-amber-500";
    };

    return (
      <div key={index} className="bg-white rounded-lg p-4 shadow mb-4 md:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="mb-2">
            <div className="text-xs font-semibold text-gray-500">NGO/Cause Name</div>
            <div className="font-medium">{donation.ngoName}</div>
          </div>
          <div className="mb-2">
            <div className="text-xs font-semibold text-gray-500">Status</div>
            <div className={`font-medium ${getStatusColor(donation.status)}`}>
            {donation.status}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-xs font-semibold text-gray-500">Donor Name</div>
            <div className="text-sm">{donation.userName}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500">Email</div>
            <div className="text-sm truncate">{donation.userEmail}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500">Request Date</div>
            <div className="text-sm">{formatDate(donation.requestedAt)}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500">Amount</div>
            <div className="text-sm">₹{donation.amount}</div>
          </div>

          {activeTab === "Completed" && (
            <div className="col-span-2">
              <div className="text-xs font-semibold text-gray-500">Paid Date</div>
              <div className="text-sm">{formatDate(donation.paidAt)}</div>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setSelectedGivebackRequest(donation)}
            className="border px-3 py-1 border-amber-500 text-amber-500 rounded hover:bg-amber-500 hover:text-white transition-colors duration-200 text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  // Update the table rows rendering
  const renderTableRows = () => {
    if (loading) {
      return (
        <>
          {/* Desktop skeleton */}
          {[...Array(itemsPerPage)].map((_, index) => (
            <SkeletonRow key={`row-${index}`} />
          ))}

          {/* Mobile skeleton */}
          {[...Array(itemsPerPage)].map((_, index) => (
            <SkeletonCard key={`card-${index}`} />
          ))}
        </>
      );
    }

    if (displayedDonations.length === 0) {
      return renderEmptyMessage();
    }

    return (
      <>
        {/* Desktop table rows */}
        {displayedDonations.map((donation, index) => (
          <tr key={`row-${index}`} className="border-t hidden md:table-row">
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
              className={`py-4 font-medium ${donation.status === "Completed" ? "text-emerald-500" : "text-amber-500"}`}
            >
              {donation.status}
            </td>
            <td className="py-4">
              <button
                onClick={() => setSelectedGivebackRequest(donation)}
                className="border px-2 py-1 border-amber-500 hover:bg-amber-500 hover:text-white transition-colors duration-200"
              >
                View Details
              </button>
            </td>
          </tr>
        ))}

        {/* Mobile cards */}
        <div className="md:hidden">
          {displayedDonations.map((donation, index) => renderCard(donation, index))}
        </div>
      </>
    );
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
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div>
          {/* Header */}
          <button
            onClick={() => setSelectedGivebackRequest(null)}
            className="flex items-center gap-2 md:gap-3 text-gray-600 hover:text-gray-900 transition-colors mb-4 md:mb-8 group"
            aria-label="Go back"
          >
            <IoArrowBack className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg md:text-xl font-medium">
              Giveback Request Details
            </span>
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4 md:p-6">
              <h2 className="text-white text-lg md:text-2xl font-semibold">
                Request ID: # <br /><span className="break-all">{selectedGivebackRequest.historyId}</span>
              </h2>
            </div>

            {/* Card Content */}
            <div className="p-4 md:p-8">
              {ngoLoading ? (
                <SkeletonDetails />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {/* Name */}
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-violet-50 rounded-lg">
                      <BsPerson className="w-4 h-4 md:w-5 md:h-5 text-violet-500" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-gray-500 mb-1">
                        Doner Name
                      </div>
                      <div className="font-medium text-sm md:text-base text-gray-900">
                        {selectedGivebackRequest.userName}
                      </div>
                    </div>
                  </div>

                  {/* NGO Name */}
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-violet-50 rounded-lg">
                      <BsPerson className="w-4 h-4 md:w-5 md:h-5 text-violet-500" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-gray-500 mb-1">NGO Name</div>
                      <div className="font-medium text-sm md:text-base text-gray-900">
                        {ngoDetails?.causeName || "N/A"}
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
                      <div className="font-medium text-sm md:text-base text-gray-900 break-all">
                        {selectedGivebackRequest.userEmail}
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
                        ₹{selectedGivebackRequest.amount}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 border rounded-lg bg-gray-50 col-span-1 md:col-span-2">
                    <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                      <BsBank2 className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-gray-500 mb-1">
                        Payment Method
                      </div>
                      {paymentDetails?.bankAccounts?.length > 0 ? (
                        <div className="font-medium text-gray-900 space-y-1">
                          <div className="text-xs md:text-sm text-gray-600">
                            Account Name:{" "}
                            {paymentDetails.bankAccounts[0].accountName}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600">
                            IFSC Code: {paymentDetails.bankAccounts[0].ifscCode}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600">
                            Account Number:{" "}
                            {paymentDetails.bankAccounts[0].accountNumber}
                          </div>
                        </div>
                      ) : paymentDetails?.upiDetails?.length > 0 ? (
                        <div className="font-medium text-xs md:text-sm text-gray-600">
                          UPI ID: {paymentDetails.upiDetails[0].upiId}
                        </div>
                      ) : (
                        <div className="text-xs md:text-sm text-gray-600">
                          No payment details available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Requested Date */}
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-amber-50 rounded-lg">
                      <BsCalendar className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-gray-500 mb-1">
                        Requested Date
                      </div>
                      <div className="font-medium text-sm md:text-base text-gray-900">
                        {formatDate(selectedGivebackRequest.requestedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Paid Date (if applicable) */}
                  {selectedGivebackRequest.status === "Completed" && (
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                        <BsCalendar className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-xs md:text-sm text-gray-500 mb-1">
                          Paid Date
                        </div>
                        <div className="font-medium text-sm md:text-base text-gray-900">
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

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-8 gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-xl">Give Backs</h1>
        </div>
        <div className="relative w-full md:w-auto">
          <select
            className="appearance-none border rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
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

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-4 md:mb-8">
          <button
            className={`px-3 py-1 md:px-4 md:py-2 rounded-full whitespace-nowrap text-sm ${activeTab === "requested"
              ? "bg-amber-500 text-white"
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
            className={`px-3 py-1 md:px-4 md:py-2 rounded-full whitespace-nowrap text-sm ${activeTab === "Completed"
              ? "bg-amber-500 text-white"
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
          <table className="w-full hidden md:table">
            <thead>{renderTableHeaders()}</thead>
            <tbody>{renderTableRows()}</tbody>
          </table>

          {/* Mobile card view - already rendered in renderTableRows() */}
          <div className="md:hidden">
            {loading ?
              [...Array(itemsPerPage)].map((_, index) => <SkeletonCard key={`mobile-card-${index}`} />)
              :
              displayedDonations.length === 0 ?
                renderEmptyMessage()
                :
                displayedDonations.map((donation, index) => renderCard(donation, index))
            }
          </div>

          {/* Pagination */}
          <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-xs md:text-sm text-gray-500 text-center md:text-left">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredGiveBackRequest.length)}{" "}
              of {filteredGiveBackRequest.length}
            </div>
            <div className="flex items-center justify-center md:justify-end gap-1 md:gap-2">
              <button
                className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <div className="flex items-center">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  // Show ellipsis for large page numbers
                  const pageNum = totalPages <= 5
                    ? i + 1
                    : currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i;

                  return (
                    <button
                      key={i}
                      className={`w-6 h-6 md:w-8 md:h-8 rounded text-xs md:text-sm ${currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                        }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm disabled:opacity-50"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Givebacks;