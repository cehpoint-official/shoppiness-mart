import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaSpinner, FaEye, FaBell, FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../../../firebase";
import axios from "axios";
import toast from "react-hot-toast";

const PlatformEarningsFromBusiness = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { userId } = useParams();

  // Fetch active businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const q = query(
          collection(db, "businessDetails"),
          where("status", "==", "Active")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBusinesses(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Send reminder email
  const sendReminderEmail = async (business) => {
    setSendingEmail(business.id);

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; border-top: 5px solid #179A56;">
          <h2 style="color: #333; margin-bottom: 20px; text-align: center;">Payment Reminder: Platform Earnings Due</h2>
          <p style="color: #666;">Dear ${business.businessName},</p>
          <p style="color: #666;">We hope this email finds you well. This is a friendly reminder that you have an outstanding balance of <strong>Rs. ${business.totalPlatformEarningsDue?.toLocaleString()}</strong> due for platform earnings.</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #179A56;">
            <p style="margin: 5px 0;"><strong>Business Name:</strong> ${
              business.businessName
            }</p>
            <p style="margin: 5px 0;"><strong>Total Amount Due:</strong> Rs. ${business.totalPlatformEarningsDue?.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p style="color: #666;">Please arrange for the payment at your earliest convenience. If you've already processed the payment, kindly disregard this reminder.</p>
          <p style="color: #666;">For any questions regarding this payment, please contact our finance team at finance@shoppinessmart.com.</p>
        
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">Best regards,</p>
            <p style="color: #666; margin: 5px 0;">The ShoppinessMart Admin Team</p>
          </div>
        </div>
      </div>
    `;

    try {
      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: business.email,
        title: "ShoppinessMart - Platform Earnings Payment Reminder",
        body: emailTemplate,
      });
      toast.success("Payment reminder email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send reminder email");
    } finally {
      setSendingEmail(null);
    }
  };

  // Filter businesses based on search term
  const filteredBusinesses = businesses.filter((business) =>
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBusinesses = filteredBusinesses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Skeleton loader
  const SkeletonLoader = () => (
    <>
      {[...Array(itemsPerPage)].map((_, index) => (
        <div 
          key={index} 
          className="animate-pulse mb-4 p-4 border rounded-lg bg-white"
        >
          <div className="flex flex-col space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="flex justify-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="flex justify-center space-x-2">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  // Business card for mobile view
  const BusinessCard = ({ business }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium text-gray-900 flex-1 truncate">
          {business.businessName}
        </div>
        <div className="flex-shrink-0">
          <img
            src={business.logoUrl}
            alt="Business Logo"
            className="h-10 w-10 rounded-full border-2 border-gray-200 shadow-sm"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <div className="text-xs text-gray-500">Total Due</div>
          <div className={`text-sm font-semibold px-2 py-1 rounded-lg text-center ${
            business.totalPlatformEarningsDue > 0
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}>
            Rs. {business.totalPlatformEarningsDue?.toLocaleString() || 0}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Total Paid</div>
          <div className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-center">
            Rs. {business.totalPlatformEarningsPaid?.toLocaleString() || 0}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2 justify-center mx-2">
        <button
          onClick={() => navigate(`/admin/${userId}/shoppiness/services/earnings/${business.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md flex items-center transition-colors text-sm flex-1 justify-center"
        >
          <FaEye className="mr-1" /> View
        </button>
        
        <button
          onClick={() => sendReminderEmail(business)}
          disabled={
            !business.totalPlatformEarningsDue ||
            business.totalPlatformEarningsDue <= 0 ||
            sendingEmail === business.id
          }
          className={`py-1 px-2 rounded-md flex items-center justify-center transition-colors text-sm flex-1 ${
            !business.totalPlatformEarningsDue ||
            business.totalPlatformEarningsDue <= 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {sendingEmail === business.id ? (
            <FaSpinner className="mr-1 animate-spin" />
          ) : (
            <FaBell className="mr-1" />
          )}
          Send Reminder
        </button>
      </div>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-8 text-gray-500">
      <div className="flex flex-col items-center">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p className="mt-2 text-lg">No businesses found.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 mx-2 sm:m-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 border-b pb-3">
        Active Businesses
      </h2>

      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by business name"
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Table (visible only on medium screens and up) */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
            <tr>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Business Name
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                Logo
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                Total Due
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                Total Paid
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!loading && paginatedBusinesses.length > 0 ? (
              paginatedBusinesses.map((business, index) => (
                <tr
                  key={business.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {business.businessName}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <img
                        src={business.logoUrl}
                        alt="Business Logo"
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-gray-200 shadow-sm"
                      />
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    <div
                      className={`text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full inline-block ${
                        business.totalPlatformEarningsDue > 0
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      Rs.{" "}
                      {business.totalPlatformEarningsDue?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    <div className="text-xs sm:text-sm font-semibold bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full inline-block">
                      Rs.{" "}
                      {business.totalPlatformEarningsPaid?.toLocaleString() ||
                        0}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/${userId}/shoppiness/services/earnings/${business.id}`
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 sm:px-3 rounded-md flex items-center transition-colors text-xs sm:text-sm"
                      >
                        <FaEye className="mr-1" /> View
                      </button>

                      <button
                        onClick={() => sendReminderEmail(business)}
                        disabled={
                          !business.totalPlatformEarningsDue ||
                          business.totalPlatformEarningsDue <= 0 ||
                          sendingEmail === business.id
                        }
                        className={`py-1 px-2 sm:px-3 rounded-md flex items-center transition-colors text-xs sm:text-sm ${
                          !business.totalPlatformEarningsDue ||
                          business.totalPlatformEarningsDue <= 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-amber-500 hover:bg-amber-600 text-white"
                        }`}
                      >
                        {sendingEmail === business.id ? (
                          <FaSpinner className="mr-1 animate-spin" />
                        ) : (
                          <FaBell className="mr-1" />
                        )}
                        Send Reminder
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : !loading ? (
              <tr>
                <td colSpan="5">
                  <EmptyState />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Mobile view (cards) */}
      <div className="md:hidden">
        {loading ? (
          <SkeletonLoader />
        ) : paginatedBusinesses.length > 0 ? (
          paginatedBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Pagination - redesigned for responsiveness */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg">
        <div className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-0">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(startIndex + itemsPerPage, filteredBusinesses.length)}
          </span>{" "}
          of <span className="font-medium">{filteredBusinesses.length}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <div className="flex">
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const pageNum = currentPage > 2 ? currentPage - 2 + i + 1 : i + 1;
              if (pageNum <= totalPages) {
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 mx-1 flex items-center justify-center rounded-md text-xs sm:text-sm ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
          </div>
          <button
            className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformEarningsFromBusiness;