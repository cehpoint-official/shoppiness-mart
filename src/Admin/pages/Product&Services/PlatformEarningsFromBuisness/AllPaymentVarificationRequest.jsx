import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";

import { FaEye } from "react-icons/fa";
import { TbClockSearch } from "react-icons/tb";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../../../firebase";

const AllPaymentVerificationRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Checking");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { userId, id } = useParams();
  const navigate = useNavigate();

  // Fetch payment verification requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const baseQuery = query(
          collection(db, "paymentByBusiness"),
          where("businessId", "==", id),
          where(
            "status",
            "==",
            activeTab === "Checking" ? "Checking" : "Completed"
          )
        );
        const snapshot = await getDocs(baseQuery);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [activeTab, id]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = requests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Improved Skeleton loader that matches table structure
  const SkeletonLoader = () => (
    <>
      {[...Array(itemsPerPage)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 rounded w-28"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between relative top-4 left-4">
        <button
          onClick={() => navigate(`/admin/${userId}/shoppiness/services/earnings`)}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <span className="text-xl">← Back to Earnings</span> 
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 m-10">
        <h2 className="text-xl font-bold mb-6">Payment Verification Requests</h2>

        {/* Tabs */}
        <div className="flex border-b mb-6 flex-wrap">
          <button
            className={`py-2 px-4 font-medium ${activeTab === "Checking"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => handleTabChange("Checking")}
          >
            <div className="flex items-center">
              <TbClockSearch className="mr-2" />
              Under Verification
            </div>
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === "Completed"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => handleTabChange("Completed")}
          >
            <div className="flex items-center">
              <IoMdCheckmarkCircleOutline className="mr-2" />
              Completed Payments
            </div>
          </button>
        </div>

        {/* Table with improved loading state */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <SkeletonLoader />
              ) : paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.businessName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.invoiceId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Rs. {request.amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.requestDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === "Checking"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/${userId}/shoppiness/services/earnings/${id}/${request.id}`
                            )
                          }
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
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination with skeleton state */}
        <div className="mt-6 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">
            {loading ? (
              <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
            ) : (
              <>
                Showing {startIndex + 1} -{" "}
                {Math.min(startIndex + itemsPerPage, requests.length)} of{" "}
                {requests.length}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm disabled:opacity-50"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 text-sm disabled:opacity-50"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPaymentVerificationRequest;
