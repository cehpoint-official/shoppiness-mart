import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { useSelector } from "react-redux";
import {
  FaSpinner,
  FaEye,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaMoneyBillWave,
} from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdPending } from "react-icons/md";
import { useParams } from "react-router-dom";
import { db } from "../../../../firebase";

const AllMoneySendToPlatform = () => {
  // State management
  const [platformEarnings, setPlatformEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const { id } = useParams();
  // Get user from Redux store
  const { user } = useSelector((state) => state.businessUserReducer);
  const itemsPerPage = 10;

  // Initial data fetch
  useEffect(() => {
    fetchTotalCount();
    fetchEarnings();
  }, [activeTab, currentPage]);

  // Calculate total amount whenever data changes
  useEffect(() => {
    const total = platformEarnings.reduce(
      (sum, earning) => sum + (earning.amountEarned || 0),
      0
    );
    setTotalAmount(total);
  }, [platformEarnings]);

  // Fetch total count for pagination
  const fetchTotalCount = async () => {
    try {
      const baseQuery = query(
        collection(db, "platformEarnings"),
        where("businessId", "==", id),
        where(
          "paymentStatus",
          "==",
          activeTab === "pending" ? "Pending" : "Completed"
        )
      );

      const snapshot = await getDocs(baseQuery);
      const totalCount = snapshot.size;
      setTotalItems(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    } catch (error) {
      console.error("Error fetching total count:", error);
    }
  };

  // Fetch earnings data
  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const startIndex = (currentPage - 1) * itemsPerPage;

      // Base query with business ID filter
      const baseQuery = query(
        collection(db, "platformEarnings"),
        where("businessId", "==", id),
        where(
          "paymentStatus",
          "==",
          activeTab === "pending" ? "Pending" : "Completed"
        )
      );

      const earningsSnapshot = await getDocs(baseQuery);

      // Map the data
      const earningsData = earningsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPlatformEarnings(earningsData);
    } catch (error) {
      console.error("Error fetching platform earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();

    // If search term is empty, fetch all earnings
    if (!searchTerm.trim()) {
      fetchTotalCount();
      fetchEarnings();
      return;
    }

    // Filter the earnings based on search term
    setLoading(true);

    // Implement searching
    const performSearch = async () => {
      try {
        // Get all data for searching
        const baseQuery = query(
          collection(db, "platformEarnings"),
          where("businessId", "==", id),
          where(
            "paymentStatus",
            "==",
            activeTab === "pending" ? "Pending" : "Completed"
          )
        );

        const snapshot = await getDocs(baseQuery);

        // Client-side filtering
        const allData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = allData.filter(
          (earning) =>
            earning.customerName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            earning.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setPlatformEarnings(filtered);
        setTotalItems(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
      } catch (error) {
        console.error("Error searching earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  };

  // Mark payment as completed
  const markAsPaid = async (earning) => {
    if (
      !confirm(
        `Confirm that you've sent payment for Invoice #${earning.invoiceId}?`
      )
    ) {
      return;
    }

    setProcessing(true);
    try {
      const earningRef = doc(db, "platformEarnings", earning.id);

      // Update the document
      await updateDoc(earningRef, {
        paymentStatus: "Completed",
        paidAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        paymentNotes: `Payment sent by ${
          user.businessName
        } on ${new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`,
      });

      // Send email notification to admin
      // await sendAdminNotificationEmail({
      //   subject: `Platform Payment Received - Invoice #${earning.invoiceId}`,
      //   businessName: user.businessName,
      //   businessId: user.id,
      //   amount: earning.amountEarned,
      //   invoiceId: earning.invoiceId,
      //   paidAt: new Date().toLocaleString()
      // });

      // Refresh the data
      fetchTotalCount();
      fetchEarnings();

      // If in detail view, update selected earning
      if (viewDetails && selectedEarning?.id === earning.id) {
        setSelectedEarning({
          ...earning,
          paymentStatus: "Completed",
          paidAt: new Date().toISOString(),
          paymentNotes: `Payment sent by ${
            user.businessName
          } on ${new Date().toLocaleString()}`,
        });
      }

      alert("Payment marked as completed successfully!");
    } catch (error) {
      console.error("Error marking payment as completed:", error);
      alert("Failed to mark payment as completed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // View earnings details
  const viewEarningDetails = (earning) => {
    setSelectedEarning(earning);
    setViewDetails(true);
  };

  // Back to earnings list
  const backToList = () => {
    setViewDetails(false);
    setSelectedEarning(null);
  };

  // EmptyState component
  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg mt-4">
      <FaFilter className="text-gray-400 text-5xl mb-4" />
      <h3 className="text-xl font-medium text-gray-600 mb-2">No Data Found</h3>
      <p className="text-gray-500 text-center">{message}</p>
    </div>
  );

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-6 gap-4 p-4 border-b">
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
      </div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="grid grid-cols-6 gap-4 p-4 border-b">
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
          <div className="h-4 bg-gray-200 rounded col-span-1"></div>
        </div>
      ))}
    </div>
  );

  // Calculate start index for display
  const startIndex = (currentPage - 1) * itemsPerPage;

  // If in detail view, render the details component
  if (viewDetails && selectedEarning) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={backToList}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to List
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
          Platform Earnings Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Invoice Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 font-medium">Invoice ID:</span>
                <p className="text-gray-800">{selectedEarning.invoiceId}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">
                  Amount Earned:
                </span>
                <p className="text-xl font-bold text-green-600">
                  Rs. {selectedEarning.amountEarned?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">
                  Payment Status:
                </span>
                <div className="flex items-center mt-1">
                  {selectedEarning.paymentStatus === "Pending" ? (
                    <>
                      <MdPending className="text-orange-500 mr-2" />
                      <span className="text-orange-500 font-medium">
                        Pending
                      </span>
                    </>
                  ) : (
                    <>
                      <IoMdCheckmarkCircleOutline className="text-green-500 mr-2" />
                      <span className="text-green-500 font-medium">
                        Completed
                      </span>
                    </>
                  )}
                </div>
              </div>
              {selectedEarning.paidAt && (
                <div>
                  <span className="text-gray-600 font-medium">Paid At:</span>
                  <p className="text-gray-800">
                    {new Date(
                      selectedEarning.paidAt.seconds * 1000
                    ).toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <span className="text-gray-600 font-medium">Due Date:</span>
                <p className="text-gray-800">{selectedEarning.dueDate}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Customer Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 font-medium">
                  Customer Name:
                </span>
                <p className="text-gray-800">{selectedEarning.customerName}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">
                  Customer Email:
                </span>
                <p className="text-gray-800">{selectedEarning.customerEmail}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Customer ID:</span>
                <p className="text-gray-800">{selectedEarning.customerId}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Payment Information
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-4">
              Platform Bank Details
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600 text-sm">Account Holder</span>
                <p className="font-medium">ShoppinessMart Pvt Ltd</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Bank Name</span>
                <p className="font-medium">HDFC Bank</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Account Number</span>
                <p className="font-medium">50100123456789</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">IFSC Code</span>
                <p className="font-medium">HDFC0001234</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Branch</span>
                <p className="font-medium">Goa Main Branch</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">UPI ID</span>
                <p className="font-medium">payments@shopinesmart</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Please include your Invoice ID (
                {selectedEarning.invoiceId}) in the payment reference to help us
                match your payment correctly.
              </p>
            </div>
          </div>
        </div>

        {selectedEarning.paymentStatus === "Pending" && (
          <div className="mt-8 text-center">
            <button
              onClick={() => markAsPaid(selectedEarning)}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center mx-auto"
            >
              {processing ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Processing...
                </>
              ) : (
                <>
                  <FaMoneyBillWave className="mr-2" /> Mark as Paid
                </>
              )}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Click this button after you have sent the payment to confirm
              completion
            </p>
          </div>
        )}
      </div>
    );
  }

  // Main component render - Earnings Table
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Platform Earnings Management</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "pending"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          <div className="flex items-center">
            <MdPending className="mr-2" />
            Pending Payments
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "completed"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          <div className="flex items-center">
            <IoMdCheckmarkCircleOutline className="mr-2" />
            Completed Payments
          </div>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by invoice ID or customer name"
                className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-md">
          <span className="text-gray-700 font-medium mr-2">Total:</span>
          <span className="text-green-600 font-bold">
            Rs. {totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6">
                  <SkeletonLoader />
                </td>
              </tr>
            ) : platformEarnings.length > 0 ? (
              platformEarnings.map((earning) => (
                <tr key={earning.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {earning.invoiceId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {earning.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {earning.customerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      Rs. {earning.amountEarned?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {earning.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        earning.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {earning.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => viewEarningDetails(earning)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <FaEye className="mr-1" /> View
                      </button>

                      {earning.paymentStatus === "Pending" && (
                        <button
                          onClick={() => markAsPaid(earning)}
                          disabled={processing}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          {processing && earning.id === selectedEarning?.id ? (
                            <FaSpinner className="animate-spin mr-1" />
                          ) : (
                            <FaMoneyBillWave className="mr-1" />
                          )}
                          Mark as Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <EmptyState
                    message={
                      activeTab === "pending"
                        ? "No pending platform payments found. All your obligations are up to date!"
                        : "No completed platform payments found yet."
                    }
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && platformEarnings.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            {totalPages <= 5 ? (
              // Show all pages if 5 or fewer
              [...Array(totalPages)].map((_, i) => (
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
              ))
            ) : (
              // Show limited pages with ellipsis for larger page counts
              <>
                {/* First page */}
                <button
                  className={`w-8 h-8 rounded-sm text-sm ${
                    currentPage === 1
                      ? "bg-[#F59E0B] text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>

                {/* Ellipsis if not near first page */}
                {currentPage > 3 && <span className="px-2">...</span>}

                {/* Pages around current page */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show current page and 1 page before/after
                  if (
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    (pageNum === currentPage ||
                      pageNum === currentPage - 1 ||
                      pageNum === currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        className={`w-8 h-8 rounded-sm text-sm ${
                          currentPage === pageNum
                            ? "bg-[#F59E0B] text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}

                {/* Ellipsis if not near last page */}
                {currentPage < totalPages - 2 && (
                  <span className="px-2">...</span>
                )}

                {/* Last page */}
                <button
                  className={`w-8 h-8 rounded-sm text-sm ${
                    currentPage === totalPages
                      ? "bg-[#F59E0B] text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
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
  );
};

export default AllMoneySendToPlatform;
