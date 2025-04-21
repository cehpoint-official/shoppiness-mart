import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { db } from "../../../../../firebase";
import toast from "react-hot-toast";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const NgoRequest = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [viewMode, setViewMode] = useState("list");
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [ngoRequests, setNgoRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "causeDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const ngoData = doc.data();
        if (ngoData && ngoData.causeName) {
          data.push({ id: doc.id, ...ngoData });
        }
      });
      setNgoRequests(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAcceptRequest = async (ngo) => {
    setAccepting(true);
    try {
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2c5282;">Congratulations! Your NGO Registration is Approved</h2>
          </div>
          
          <p>Dear ${ngo.firstName} ${ngo.lastName},</p>
          
          <p>We are pleased to inform you that your NGO "${ngo.causeName}" has been approved on Shoppiness Mart. You can now start using our platform to showcase your cause and connect with potential donors.</p>
          
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-bottom: 10px;">Your Login Credentials:</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${ngo.email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${ngo.password}</p>
          </div>
          
          <p>Please login to your dashboard to:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin: 10px 0;">✅ Complete your NGO profile</li>
            <li style="margin: 10px 0;">✅ Add your campaigns and initiatives</li>
            <li style="margin: 10px 0;">✅ Connect with donors</li>
          </ul>
          
          <p>For any assistance, please don't hesitate to contact our support team.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0; color: #4a5568;"><strong>The Shoppiness Mart Team</strong></p>
          </div>
        </div>
      `;

      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: ngo.email,
        title: "Shoppiness Mart - NGO Registration Approved!",
        body: emailTemplate,
      });

      const ngoRef = doc(db, "causeDetails", ngo.id);
      await updateDoc(ngoRef, {
        status: "Active",
        approvedDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      toast.success("Request accepted successfully");
      fetchData();
      setViewMode("list");
    } catch (error) {
      console.error("Error in handleAcceptRequest:", error);
      toast.error("Failed to accept request. No changes were made.");
    } finally {
      setAccepting(false);
    }
  };

  const handleRejectRequest = async (ngo) => {
    setRejecting(true);
    try {
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #c53030;">NGO Registration Status Update</h2>
          </div>
          
          <p>Dear ${ngo.firstName} ${ngo.lastName},</p>
          
          <p>Thank you for your interest in registering "${ngo.causeName}" on Shoppiness Mart. After careful review of your application, we regret to inform you that we are unable to approve your NGO registration at this time.</p>
          
          <p>This decision could be due to one or more of the following reasons:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin: 10px 0;">• Incomplete or incorrect documentation</li>
            <li style="margin: 10px 0;">• Unable to verify NGO credentials</li>
            <li style="margin: 10px 0;">• Does not meet our current platform requirements</li>
          </ul>
          
          <p>You are welcome to submit a new application after addressing these potential issues. If you need clarification or have any questions, please don't hesitate to contact our support team.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0; color: #4a5568;"><strong>The Shoppiness Mart Team</strong></p>
          </div>
        </div>
      `;

      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: ngo.email,
        title: "Shoppiness Mart - NGO Registration Update",
        body: emailTemplate,
      });

      const ngoRef = doc(db, "causeDetails", ngo.id);
      await updateDoc(ngoRef, {
        status: "Rejected",
        rejectedDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      toast.success("Request rejected successfully");
      fetchData();
      setViewMode("list");
    } catch (error) {
      console.error("Error in handleRejectRequest:", error);
      toast.error("Failed to reject request. No changes were made.");
    } finally {
      setRejecting(false);
    }
  };

  const displayData = ngoRequests.filter((ngo) =>
    activeTab === "Pending"
      ? ngo.status === "Pending"
      : ngo.status === "Rejected"
  );
  const totalPages = Math.ceil(displayData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = displayData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleViewDetails = (ngo) => {
    setSelectedNGO(ngo);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedNGO(null);
  };

  if (viewMode === "detail" && selectedNGO) {
    return (
      <div className="p-3 md:p-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 md:mb-8"
        >
          <FaArrowLeft className="w-4 h-4" />
          View request
        </button>

        <div className="bg-white rounded-lg p-4 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="relative rounded-lg overflow-hidden h-48 md:h-64">
              <img
                src={selectedNGO.bannerUrl || "/placeholder.svg"}
                alt="NGO Featured Image"
                className="object-cover h-full w-full"
              />
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold mb-1 break-words">
                    {selectedNGO.causeName}
                  </h1>
                  <p className="text-gray-600">{selectedNGO.type}</p>
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0 ml-2">
                  <img
                    src={selectedNGO.logoUrl || "/placeholder.svg"}
                    alt="NGO Logo"
                    className="object-contain"
                  />
                </div>
              </div>

              <div>
                <h2 className="font-medium mb-1 md:mb-2">About Cause</h2>
                <p className="text-gray-600 text-sm md:text-base break-words">{selectedNGO.aboutCause}</p>
              </div>

              <div>
                <h2 className="font-medium mb-1 md:mb-2">Cause / NGO Description</h2>
                <p className="text-gray-600 text-sm md:text-base break-words">{selectedNGO.shortDesc}</p>
              </div>

              <div>
                <h2 className="font-medium mb-1 md:mb-2">Location</h2>
                <p className="text-gray-600 text-sm md:text-base">{selectedNGO.location}</p>
              </div>

              <div>
                <h2 className="font-medium mb-1 md:mb-2">PIN</h2>
                <p className="text-gray-600 text-sm md:text-base">{selectedNGO.pincode}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h2 className="font-medium mb-1 md:mb-2">Account Created by</h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    {selectedNGO.firstName + " " + selectedNGO.lastName}
                  </p>
                </div>
                <div>
                  <h2 className="font-medium mb-1 md:mb-2">Phone Number</h2>
                  <p className="text-gray-600 text-sm md:text-base">{selectedNGO.mobileNumber}</p>
                </div>
                <div>
                  <h2 className="font-medium mb-1 md:mb-2">Email ID</h2>
                  <p className="text-gray-600 text-sm md:text-base break-words">{selectedNGO.email}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-4">
                {activeTab === "Pending" && (
                  <button
                    onClick={() => handleRejectRequest(selectedNGO)}
                    disabled={rejecting || accepting}
                    className="px-4 sm:px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    {rejecting && <FaSpinner className="animate-spin" />}
                    Reject Request
                  </button>
                )}
                <button
                  onClick={() => handleAcceptRequest(selectedNGO)}
                  disabled={accepting || rejecting}
                  className="px-4 sm:px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  {accepting && <FaSpinner className="animate-spin" />}
                  Accept Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <h1 className="text-xl md:text-2xl font-normal mb-4 md:mb-8">NGO/Cause Requests</h1>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 md:mb-8">
        <button
          onClick={() => setActiveTab("Pending")}
          className={`px-4 md:px-6 py-2 rounded-md transition-colors ${
            activeTab === "Pending"
              ? "bg-[#F7941D] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          NGO/Cause Requests
        </button>
        <button
          onClick={() => setActiveTab("Rejected")}
          className={`px-4 md:px-6 py-2 rounded-md transition-colors ${
            activeTab === "Rejected"
              ? "bg-[#F7941D] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          Rejected NGO/Cause Requests
        </button>
      </div>

      <div className="bg-white rounded-lg p-2 md:p-3 shadow-sm">
        {loading ? (
          <div className="space-y-4 md:space-y-8">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row border p-3 rounded-xl items-center gap-4 md:gap-6 animate-pulse"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-gray-200 rounded"></div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="hidden md:block flex-1 min-w-0 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="hidden md:block flex-1 min-w-0 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="hidden md:block flex-1 min-w-0 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : paginatedData.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Mobile view - Card layout */}
              <div className="md:hidden space-y-4">
                {paginatedData.map((ngo) => (
                  <div key={ngo.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ngo.logoUrl || "/placeholder.svg"}
                        alt={`${ngo.causeName} logo`}
                        className="w-16 h-16 object-contain"
                      />
                      <div>
                        <h3 className="font-medium text-base">{ngo.causeName}</h3>
                        <p className="text-gray-500 text-xs">Location: {ngo.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className="text-gray-900 text-sm">{ngo.mobileNumber}</p>
                        <p className="text-gray-500 text-xs">Phone</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-900 text-sm break-words">{ngo.email}</p>
                        <p className="text-gray-500 text-xs">Email</p>
                      </div>
                      
                      {activeTab === "Pending" ? (
                        <div>
                          <p className="text-sm">{ngo.createdDate}</p>
                          <p className="text-xs text-gray-500">Requested Date</p>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm">{ngo.createdDate}</p>
                            <p className="text-xs text-gray-500">Requested Date</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-red-500">{ngo.rejectedDate || "N/A"}</p>
                            <p className="text-xs text-gray-500">Rejected Date</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleViewDetails(ngo)}
                      className="w-full text-center text-blue-500 border border-blue-600 px-2 py-1 hover:text-blue-600 transition-colors rounded-md"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Desktop view - Table layout */}
              <table className="hidden md:table w-full">
                <tbody>
                  {paginatedData.map((ngo) => (
                    <tr key={ngo.id} className="border-b border-t">
                      <td className="p-3">
                        <img
                          src={ngo.logoUrl || "/placeholder.svg"}
                          alt={`${ngo.causeName} logo`}
                          className="w-20 h-20 object-contain"
                        />
                      </td>
                      <td className="p-3">
                        <h3 className="font-medium text-lg">{ngo.causeName}</h3>
                        <p className="text-gray-500 text-sm">
                          Location: {ngo.location}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="text-gray-900">{ngo.mobileNumber}</p>
                        <p className="text-gray-500 text-sm">Phone</p>
                      </td>
                      <td className="p-3">
                        <p className="text-gray-900">{ngo.email}</p>
                        <p className="text-gray-500 text-sm">Email</p>
                      </td>
                      <td className="p-3">
                        {activeTab === "Pending" ? (
                          <>
                            <p className="text-sm">{ngo.createdDate}</p>
                            <p className="text-xs text-gray-500">Requested Date</p>
                          </>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm">{ngo.createdDate}</p>
                              <p className="text-xs text-gray-500">
                                Requested Date
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-red-500">
                                {ngo.rejectedDate || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500">Rejected Date</p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleViewDetails(ngo)}
                          className="text-blue-500 border border-blue-600 px-2 py-1 hover:text-blue-600 transition-colors rounded"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600">
            {activeTab === "Pending"
              ? "No Cause / NGO have been registered yet."
              : "No rejected Cause / NGO are there."}
          </div>
        )}
      </div>

      {paginatedData.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3">
          <p className="text-sm text-gray-600 text-center sm:text-left">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, displayData.length)} of{" "}
            {displayData.length}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
            <button
              className="px-2 sm:px-4 py-1 sm:py-2 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="px-2 sm:px-4 py-1 sm:py-2 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
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

export default NgoRequest;