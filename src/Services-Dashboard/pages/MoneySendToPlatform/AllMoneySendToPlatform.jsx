import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector } from "react-redux";
import {
  FaSpinner,
  FaEye,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaUpload,
  FaFileAlt,
  FaFileImage,
} from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdPending } from "react-icons/md";
import { TbClockSearch } from "react-icons/tb";
import { useParams } from "react-router-dom";
import { db, storage } from "../../../../firebase";
import toast from "react-hot-toast";

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
  const [businessDetails, setBusinessDetails] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const fileInputRef = useRef(null);
  const { id } = useParams();

  // Get user from Redux store
  const { user } = useSelector((state) => state.businessUserReducer);
  const itemsPerPage = 10;

  // Fetch business details
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const businessRef = doc(db, "businessDetails", id);
        const businessDoc = await getDoc(businessRef);

        if (businessDoc.exists()) {
          setBusinessDetails(businessDoc.data());
        }
      } catch (error) {
        console.error("Error fetching business details:", error);
      }
    };

    fetchBusinessDetails();
  }, [id]);
  // Initial data fetch
  useEffect(() => {
    fetchTotalCount();
    fetchEarnings();
  }, [activeTab, currentPage]);

  // Calculate total amounts whenever data changes
  useEffect(() => {
    const duePayments = platformEarnings.filter(
      (earning) => earning.paymentStatus === "Pending"
    );
    const paidPayments = platformEarnings.filter(
      (earning) => earning.paymentStatus === "Completed"
    );
    const checkingPayments = platformEarnings.filter(
      (earning) => earning.paymentStatus === "Checking"
    );

    // Calculate totals based on current filter
    if (activeTab === "pending") {
      const total = duePayments.reduce(
        (sum, earning) => sum + (earning.amountEarned || 0),
        0
      );
      setTotalAmount(total);
    } else if (activeTab === "completed") {
      const total = paidPayments.reduce(
        (sum, earning) => sum + (earning.amountEarned || 0),
        0
      );
      setTotalAmount(total);
    } else if (activeTab === "checking") {
      const total = checkingPayments.reduce(
        (sum, earning) => sum + (earning.amountEarned || 0),
        0
      );
      setTotalAmount(total);
    }
  }, [platformEarnings, activeTab]);

  // Fetch total count for pagination
  const fetchTotalCount = async () => {
    try {
      const baseQuery = query(
        collection(db, "platformEarnings"),
        where("businessId", "==", id),
        where(
          "paymentStatus",
          "==",
          activeTab === "pending"
            ? "Pending"
            : activeTab === "completed"
            ? "Completed"
            : "Checking"
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
      // const startIndex = (currentPage - 1) * itemsPerPage;

      // Base query with business ID filter
      const baseQuery = query(
        collection(db, "platformEarnings"),
        where("businessId", "==", id),
        where(
          "paymentStatus",
          "==",
          activeTab === "pending"
            ? "Pending"
            : activeTab === "completed"
            ? "Completed"
            : "Checking"
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

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPaymentReceipt(e.target.files[0]);
    }
  };

  // Upload receipt and submit payment
  const uploadReceiptAndSubmitPayment = async (earning) => {
    if (!paymentReceipt) {
      toast.success("Please upload a payment receipt");
      return;
    }

    if (
      !toast.success(
        `Confirm that you've sent payment for Invoice #${earning.invoiceId}?`
      )
    ) {
      return;
    }

    setProcessing(true);
    try {
      // 1. Upload the receipt to Firebase Storage
      const fileRef = ref(
        storage,
        `receipts/${id}/${earning.id}_${paymentReceipt.name}`
      );
      await uploadBytes(fileRef, paymentReceipt);
      const receiptUrl = await getDownloadURL(fileRef);

      // 2. Create a payment verification request in a new collection
      const paymentRequest = {
        businessId: id,
        businessName: user.businessName || businessDetails?.businessName,
        businessEmail: user.email || businessDetails?.email,
        earningId: earning.id,
        invoiceId: earning.invoiceId,
        amount: earning.amountEarned,
        receiptUrl: receiptUrl,
        fileType: paymentReceipt.type.includes("image") ? "image" : "pdf",
        requestDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: "Checking",
      };

      await addDoc(collection(db, "paymentByBusiness"), paymentRequest);

      // 3. Update the earning status to "Checking"
      const earningRef = doc(db, "platformEarnings", earning.id);
      await updateDoc(earningRef, {
        paymentStatus: "Checking",
        receiptUrl: receiptUrl,
        paidAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      // 4. Update business stats
      if (businessDetails) {
        const businessRef = doc(db, "businessDetails", id);
        await updateDoc(businessRef, {
          totalPlatformEarningsDue:
            (businessDetails.totalPlatformEarningsDue || 0) -
            earning.amountEarned,
          // We don't update paid amount yet since it's still being verified
        });
      }

      // 5. Send email notification to admin
      const emailData = {
        email: "admin@shoppinessmart.com", // Replace with the admin's email
        title: "New Payment Verification Request Received",
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">New Payment Verification Request Received</h2>
            
            <p>Dear Admin,</p>
            
            <p>A new payment verification request has been submitted by a business owner. Below are the details:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <h3 style="color: #555; margin-bottom: 10px;">Payment Details</h3>
              <p><strong>Business Name:</strong> ${
                businessDetails.businessName
              }</p>
              <p><strong>Invoice ID:</strong> ${earning.invoiceId}</p>
              <p><strong>Amount:</strong> Rs. ${earning.amountEarned?.toLocaleString()}</p>
              <p><strong>Payment Status:</strong> ${earning.paymentStatus}</p>
              <p><strong>Receipt Uploaded:</strong> <a href="${receiptUrl}" target="_blank" style="color: #1a73e8; text-decoration: none;">View Receipt</a></p>
              <p><strong>Submitted On:</strong> ${new Date().toLocaleDateString(
                "en-GB",
                { day: "numeric", month: "short", year: "numeric" }
              )}</p>
            </div>
            
            <p>Please review the payment details on the admin dashboard and verify the payment accordingly.</p>
            
            
            <p>Best regards,<br>
            The ShoppinessMart Team</p>
          </div>
        `,
      };

      await axios.post(
        `${import.meta.env.VITE_AWS_SERVER}/send-email`,
        emailData
      );

      // Refresh the data
      fetchTotalCount();
      fetchEarnings();

      // Reset form
      setPaymentReceipt(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // If in detail view, update selected earning
      if (viewDetails && selectedEarning?.id === earning.id) {
        setSelectedEarning({
          ...earning,
          paymentStatus: "Checking",
          receiptUrl: receiptUrl,
          paidAt: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        });
      }

      toast.success("Payment verification request submitted successfully!");
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setProcessing(false);
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
            activeTab === "pending"
              ? "Pending"
              : activeTab === "completed"
              ? "Completed"
              : "Checking"
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
            earning.invoiceId
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (earning.approvedDate &&
              earning.approvedDate
                .toLowerCase()
                .includes(searchTerm.toLowerCase()))
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

  // View earnings details
  const viewEarningDetails = (earning) => {
    setSelectedEarning(earning);
    setViewDetails(true);
  };

  // Back to earnings list
  const backToList = () => {
    setViewDetails(false);
    setSelectedEarning(null);
    setPaymentReceipt(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      <div className="bg-white rounded-lg shadow-md p-6 m-10">
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
                  ) : selectedEarning.paymentStatus === "Checking" ? (
                    <>
                      <TbClockSearch className="text-blue-500 mr-2" />
                      <span className="text-blue-500 font-medium">
                        Verification Pending
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
              {selectedEarning.completedAt && (
                <div>
                  <span className="text-gray-600 font-medium">
                    Varification Completed Date:
                  </span>
                  <p className="text-gray-800">{selectedEarning.completedAt}</p>
                </div>
              )}
              {selectedEarning.paidAt && (
                <div>
                  <span className="text-gray-600 font-medium">
                    Paid Date:
                  </span>
                  <p className="text-gray-800">
                    {selectedEarning.paidAt}
                  </p>
                </div>
              )}
              <div>
                <span className="text-gray-600 font-medium">Due Date:</span>
                <p className="text-gray-800">{selectedEarning.dueDate}</p>
              </div>
              {selectedEarning.receiptUrl && (
                <div>
                  <span className="text-gray-600 font-medium">
                    Payment Receipt:
                  </span>
                  <p className="text-blue-600 mt-1">
                    <a
                      href={selectedEarning.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      {selectedEarning.fileType === "image" ? (
                        <FaFileImage className="mr-2" />
                      ) : (
                        <FaFileAlt className="mr-2" />
                      )}
                      View Receipt
                    </a>
                  </p>
                </div>
              )}
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
          </div>
        </div>

        {selectedEarning.paymentStatus === "Pending" && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Submit Payment Verification
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Upload Payment Receipt (Image or PDF)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Please upload a clear image or PDF of your payment
                  confirmation/receipt
                </p>
              </div>

              <button
                onClick={() => uploadReceiptAndSubmitPayment(selectedEarning)}
                disabled={processing || !paymentReceipt}
                className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center mx-auto ${
                  !paymentReceipt || processing
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {processing ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Processing...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" /> Submit Payment for
                    Verification
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main component render - Earnings Table
  return (
    <div className="bg-white rounded-lg shadow-md p-4 m-10">
      <h2 className="text-xl font-bold mb-6">Platform Earnings Management</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-800 text-sm font-medium">Total Due</h3>
              <p className="text-blue-900 text-2xl font-bold">
                Rs.{" "}
                {businessDetails?.totalPlatformEarningsDue?.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <MdPending className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-800 text-sm font-medium">
                Under Verification
              </h3>
              <p className="text-orange-900 text-2xl font-bold">
                Rs.{" "}
                {platformEarnings
                  .filter((e) => e.paymentStatus === "Checking")
                  .reduce((sum, e) => sum + (e.amountEarned || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TbClockSearch className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-800 text-sm font-medium">Total Paid</h3>
              <p className="text-green-900 text-2xl font-bold">
                Rs.{" "}
                {businessDetails?.totalPlatformEarningsPaid?.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <IoMdCheckmarkCircleOutline className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6 flex-wrap">
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
            activeTab === "checking"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("checking")}
        >
          <div className="flex items-center">
            <TbClockSearch className="mr-2" />
            Under Verification
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
                placeholder="Search by invoice ID, customer name or date"
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
          <span className="text-gray-700 font-medium mr-2">
            Current Tab Total:
          </span>
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
              {activeTab === "checking" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Date
                </th>
              )}
              {activeTab === "completed" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Date
                </th>
              )}
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
                  {activeTab === "checking" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {earning.paidAt}
                      </div>
                    </td>
                  )}
                  {activeTab === "completed" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {earning.completedAt}
                      </div>
                    </td>
                  )}
                  
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
