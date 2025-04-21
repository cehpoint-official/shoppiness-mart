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
          <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 rounded w-16 md:w-32"></div>
          </td>
          <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap hidden sm:table-cell">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </td>
          <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 rounded w-16 md:w-24"></div>
          </td>
          <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell">
            <div className="h-5 bg-gray-200 rounded w-28"></div>
          </td>
          <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 rounded-full w-16 md:w-20"></div>
          </td>
          <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
            <div className="h-5 bg-gray-200 rounded w-10 md:w-16"></div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between p-4 md:relative md:top-4 md:left-4">
        <button
          onClick={() => navigate(`/admin/${userId}/shoppiness/services/earnings`)}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <span className="text-sm md:text-xl">← Back</span> 
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-3 md:p-6 mx-2 md:m-10">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Payment Verification Requests</h2>

        {/* Tabs */}
        <div className="flex border-b mb-4 md:mb-6 flex-wrap">
          <button
            className={`py-2 px-2 md:px-4 text-sm md:text-base font-medium ${
              activeTab === "Checking"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("Checking")}
          >
            <div className="flex items-center">
              <TbClockSearch className="mr-1 md:mr-2" />
              <span className="hidden xs:inline">Under</span> Verification
            </div>
          </button>
          <button
            className={`py-2 px-2 md:px-4 text-sm md:text-base font-medium ${
              activeTab === "Completed"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("Completed")}
          >
            <div className="flex items-center">
              <IoMdCheckmarkCircleOutline className="mr-1 md:mr-2" />
              Completed
            </div>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
              <tr>
                <th className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Business
                </th>
                <th className="hidden sm:table-cell px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Amount
                </th>
                <th className="hidden md:table-cell px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
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
                    <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm font-medium text-gray-900">
                        {request.businessName}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-900">
                        {request.invoiceId}
                      </div>
                    </td>
                    <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-900">
                        Rs. {request.amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-900">
                        {request.requestDate}
                      </div>
                    </td>
                    <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === "Checking"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-2 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/${userId}/shoppiness/services/earnings/${id}/${request.id}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 flex items-center text-xs md:text-sm"
                        >
                          <FaEye className="mr-1" /> 
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-xs md:text-sm text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Responsive Pagination */}
        <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-2 md:p-4 rounded-lg">
          <div className="text-xs md:text-sm text-gray-500 mb-2 sm:mb-0">
            {loading ? (
              <div className="h-3 md:h-4 bg-gray-200 rounded w-24 md:w-40 animate-pulse"></div>
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
              className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm disabled:opacity-50"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <button
              className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm disabled:opacity-50"
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