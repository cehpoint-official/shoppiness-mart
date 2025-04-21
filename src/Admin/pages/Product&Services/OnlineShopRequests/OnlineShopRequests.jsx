import { BsArrowLeft } from "react-icons/bs";
import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const OnlineShopRequests = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedShop, setSelectedShop] = useState(null);
  const [offlineShopRequests, setOfflineShopRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [tempRate, setTempRate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // Fetch data from Firestore
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "businessDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const offlineShopData = doc.data();
        if (offlineShopData && offlineShopData.mode === "Online") {
          data.push({ id: doc.id, ...offlineShopData });
        }
      });
      setOfflineShopRequests(data);
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

  // Filter requests based on active tab
  const filteredRequests = offlineShopRequests.filter((request) =>
    activeTab === "Pending"
      ? request.status === "Pending"
      : request.status === "Rejected"
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredRequests.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  // Reset current page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);
  // Handle editing commission rate
  const handleEditRate = (shop) => {
    setEditingRate(shop.id);
    setTempRate(shop.rate || "");
  };

  // Handle accepting a request
  const handleAcceptRequest = async (shop) => {
    setAccepting(true);
    try {
      // Prepare email content
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2c5282;">Congratulations! Your Business Registration is Approved</h2>
          </div>
          
          <p>Dear ${shop.owner},</p>
          
          <p>We are pleased to inform you that your business "${shop.businessName}" has been approved on Shoppiness Mart. You can now start using our platform to showcase your products/services and connect with potential customers.</p>
          
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-bottom: 10px;">The Commission Rate:</h3>
            <p style="margin: 5px 0;"><strong>${tempRate}%</strong></p>
          </div>
          
          <p>Please login to your dashboard to:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin: 10px 0;">✅ Complete your business profile</li>
            <li style="margin: 10px 0;">✅ Add your products/services</li>
            <li style="margin: 10px 0;">✅ Connect with customers</li>
          </ul>
          
          <p>For any assistance, please don't hesitate to contact our support team.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0; color: #4a5568;"><strong>The Shoppiness Mart Team</strong></p>
          </div>
        </div>
      `;

      // Send email
      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: shop.email,
        title: "Shoppiness Mart - Business Registration Approved!",
        body: emailTemplate,
      });

      // Update Firestore document
      const shopRef = doc(db, "businessDetails", shop.id);
      await updateDoc(shopRef, {
        status: "Active",
        rate: tempRate,
        approvedDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      // Show success message and refresh data
      toast.success("Request accepted successfully");
      fetchData();
      setSelectedShop(null);
    } catch (error) {
      console.error("Error in handleAcceptRequest:", error);
      toast.error("Failed to accept request. No changes were made.");
    } finally {
      setAccepting(false);
    }
  };

  // Handle rejecting a request
  const handleRejectRequest = async (shop) => {
    setRejecting(true);
    try {
      // Prepare email content
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #c53030;">Business Registration Status Update</h2>
          </div>
          
          <p>Dear ${shop.owner},</p>
          
          <p>Thank you for your interest in registering "${shop.businessName}" on Shoppiness Mart. After careful review of your application, we regret to inform you that we are unable to approve your business registration at this time.</p>
          
          <p>This decision could be due to one or more of the following reasons:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin: 10px 0;">• Incomplete or incorrect documentation</li>
            <li style="margin: 10px 0;">• Unable to verify business credentials</li>
            <li style="margin: 10px 0;">• Does not meet our current platform requirements</li>
          </ul>
          
          <p>You are welcome to submit a new application after addressing these potential issues. If you need clarification or have any questions, please don't hesitate to contact our support team.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0; color: #4a5568;"><strong>The Shoppiness Mart Team</strong></p>
          </div>
        </div>
      `;

      // Send email
      await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
        email: shop.email,
        title: "Shoppiness Mart - Business Registration Update",
        body: emailTemplate,
      });

      // Update Firestore document
      const shopRef = doc(db, "businessDetails", shop.id);
      await updateDoc(shopRef, {
        status: "Rejected",
        rejectedDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      // Show success message and refresh data
      toast.success("Request rejected successfully");
      fetchData();
      setSelectedShop(null);
    } catch (error) {
      console.error("Error in handleRejectRequest:", error);
      toast.error("Failed to reject request. No changes were made.");
    } finally {
      setRejecting(false);
    }
  };
  if (selectedShop) {
    return (
      <div className="p-3 md:p-6">
        <button
          onClick={() => setSelectedShop(null)}
          className="flex items-center gap-2 mb-4 md:mb-8 hover:text-gray-900"
        >
          <BsArrowLeft className="w-4 h-4" />
          View request
        </button>

        <div className="bg-white p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <img
                src={selectedShop.bannerUrl || "/placeholder.svg"}
                alt={selectedShop.businessName}
                className="w-full rounded-lg object-cover aspect-square"
              />
            </div>

            <div>
              <div className="flex items-start gap-4 mb-4 md:mb-6">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold">
                    {selectedShop.businessName}
                  </h1>
                  <p className="text-gray-500">{selectedShop.cat}</p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="font-medium mb-1 md:mb-2">Description</h2>
                  <p className="text-gray-600 text-sm md:text-base">{selectedShop.shortDesc}</p>
                </div>

                <div>
                  <h2 className="font-medium mb-1 md:mb-2">Location</h2>
                  <p className="text-gray-600 text-sm md:text-base">{selectedShop.location}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <h2 className="font-medium mb-1 md:mb-2">Phone Number</h2>
                    <p className="text-gray-600 text-sm md:text-base">{selectedShop.mobileNumber}</p>
                  </div>
                  <div>
                    <h2 className="font-medium mb-1 md:mb-2">Email ID</h2>
                    <p className="text-gray-600 break-words whitespace-normal">{selectedShop.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-8">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">SHOP DETAILS</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm md:text-base">
                    <tbody className="divide-y divide-gray-200">
                      {/* Modified to use flex layout on small screens */}
                      <tr className="flex flex-col sm:table-row">
                        <td className="py-2 md:py-3 text-gray-500 font-medium sm:font-normal">
                          Business/Services Owner Name
                        </td>
                        <td className="py-2 md:py-3 pb-4 sm:pb-3">{selectedShop.owner}</td>
                      </tr>
                      <tr className="flex flex-col sm:table-row">
                        <td className="py-2 md:py-3 text-gray-500 font-medium sm:font-normal">
                          Business/Services Mode
                        </td>
                        <td className="py-2 md:py-3 pb-4 sm:pb-3">{selectedShop.mode}</td>
                      </tr>
                      <tr className="flex flex-col sm:table-row">
                        <td className="py-2 md:py-3 text-gray-500 font-medium sm:font-normal">Email</td>
                        <td className="py-2 md:py-3 pb-4 sm:pb-3">
                          <p className="break-all sm:break-normal max-w-full sm:max-w-none">
                            {selectedShop.email}
                          </p>
                        </td>
                      </tr>
                      <tr className="flex flex-col sm:table-row">
                        <td className="py-2 md:py-3 text-gray-500 font-medium sm:font-normal">
                          Shop Category
                        </td>
                        <td className="py-2 md:py-3 pb-4 sm:pb-3">{selectedShop.cat}</td>
                      </tr>
                      <tr className="flex flex-col sm:table-row">
                        <td className="py-2 md:py-3 text-gray-500 font-medium sm:font-normal">
                          Commission rate
                        </td>
                        <td className="py-2 md:py-3 pb-4 sm:pb-3 flex gap-2 md:gap-4 items-center">
                          {editingRate === selectedShop.id ? (
                            <input
                              type="text"
                              value={tempRate}
                              onChange={(e) => setTempRate(e.target.value)}
                              className="border rounded px-2 py-1 w-16 md:w-24"
                            />
                          ) : (
                            selectedShop.rate
                          )}
                          <button
                            onClick={() => handleEditRate(selectedShop)}
                            className="hover:text-blue-700"
                          >
                            <FiEdit className="text-blue-600" />
                          </button>
                        </td>
                      </tr>
                      <tr className="flex flex-col sm:table-row">
                        <td className="py-2 md:py-3 text-gray-500 font-medium sm:font-normal">
                          Terms Agreement
                        </td>
                        <td className="py-2 md:py-3 pb-4 sm:pb-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${selectedShop.termsAgreed
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                              }`}
                          >
                            {selectedShop.termsAgreed ? "Agreed" : "Not Agreed"}
                          </span>
                        </td>
                      </tr>
                      <tr className="flex flex-col sm:table-row">
                        <td className="py-2 md:py-3 text-gray-500 font-medium sm:font-normal">
                          Preferred Partner Status
                        </td>
                        <td className="py-2 md:py-3 pb-4 sm:pb-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${selectedShop.isPreferredPartner
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {selectedShop.isPreferredPartner
                              ? "Preferred Partner"
                              : "Standard Partner"}
                          </span>
                        </td>
                      </tr>
                      <tr className="flex flex-col sm:table-row">
                        <td className="py-2 md:py-3 text-gray-500 font-medium sm:font-normal">LOGO</td>
                        <td className="py-2 md:py-3 pb-4 sm:pb-3">
                          <img
                            src={selectedShop.logoUrl || "/placeholder.svg"}
                            alt="Shop logo"
                            className="w-16 h-16 md:w-24 md:h-24 object-contain"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
                {activeTab === "Pending" && (
                  <button
                    onClick={() => handleRejectRequest(selectedShop)}
                    className="px-4 md:px-6 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {rejecting && <FaSpinner className="animate-spin" />}
                    Reject Request
                  </button>
                )}
                <button
                  onClick={() => handleAcceptRequest(selectedShop)}
                  className="px-4 md:px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
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
      <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Online Shop Requests</h1>
      <div className="bg-white p-4 md:p-6 rounded-xl border shadow-md">
        {/* Tab buttons - stacked vertically on small screens, horizontal on md+ */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4 md:mb-6">
          <button
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm ${activeTab === "Pending"
                ? "bg-[#F7941D] text-white"
                : "border border-gray-300 text-gray-700"
              }`}
            onClick={() => setActiveTab("Pending")}
          >
            Product/Service Requests
          </button>
          <button
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm ${activeTab === "Rejected"
                ? "bg-[#F7941D] text-white"
                : "border border-gray-300 text-gray-700"
              }`}
            onClick={() => setActiveTab("Rejected")}
          >
            Rejected Requests
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {loading ? (
                // Skeleton loading effect
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 md:py-4 px-2 md:px-6">
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="w-12 h-12 md:w-20 md:h-20 rounded bg-gray-200 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-3 md:h-4 w-3/4 bg-gray-200 animate-pulse mb-1 md:mb-2"></div>
                          <div className="h-2 md:h-3 w-1/2 bg-gray-200 animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-6 hidden sm:table-cell">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                        <div>
                          <div className="h-3 md:h-4 w-3/4 bg-gray-200 animate-pulse mb-1 md:mb-2"></div>
                          <div className="h-2 md:h-3 w-1/2 bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="hidden md:block">
                          <div className="h-3 md:h-4 w-3/4 bg-gray-200 animate-pulse mb-1 md:mb-2"></div>
                          <div className="h-2 md:h-3 w-1/2 bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="hidden md:block">
                          <div className="h-3 md:h-4 w-3/4 bg-gray-200 animate-pulse mb-1 md:mb-2"></div>
                          <div className="h-2 md:h-3 w-1/2 bg-gray-200 animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-6 text-right sm:text-center">
                      <div className="h-6 md:h-8 w-16 md:w-24 bg-gray-200 animate-pulse ml-auto sm:mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-4 md:py-6 text-center text-gray-500">
                    {activeTab === "Pending"
                      ? "There are no pending business requests."
                      : "There are no rejected businesses"}
                  </td>
                </tr>
              ) : (
                paginatedData.map((request) => (
                  <tr key={request.id} className="border-b border-t block sm:table-row">
                    <td className="py-3 md:py-4 px-2 md:px-6 block sm:table-cell">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-2 md:gap-4">
                          <img
                            src={request.logoUrl || "/placeholder.svg"}
                            alt={request.businessName}
                            className="w-12 h-12 md:w-20 md:h-20 rounded object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-sm md:text-base">
                              {request.businessName}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500">
                              {request.location}
                            </p>
                          </div>
                        </div>

                        {/* View Details button for small screens - positioned below shop info */}
                        <button
                          onClick={() => setSelectedShop(request)}
                          className="text-blue-500 border border-blue-600 px-2 py-1 text-xs md:text-sm hover:text-blue-600 transition-colors mt-2 sm:hidden"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-6 hidden sm:table-cell">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                        <div>
                          <p className="text-xs md:text-sm">{request.mobileNumber}</p>
                          <p className="text-xs text-gray-500">Phone</p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-xs md:text-sm break-words">{request.email}</p>
                          <p className="text-xs text-gray-500">Email</p>
                        </div>
                        <div>
                          {activeTab === "Pending" ? (
                            <>
                              <p className="text-xs md:text-sm">{request.createdDate}</p>
                              <p className="text-xs text-gray-500">
                                Requested Date
                              </p>
                            </>
                          ) : (
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                              <div>
                                <p className="text-xs md:text-sm">{request.createdDate}</p>
                                <p className="text-xs text-gray-500">
                                  Requested Date
                                </p>
                              </div>
                              <div>
                                <p className="text-xs md:text-sm text-red-500">
                                  {request.rejectedDate || "N/A"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Rejected Date
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-6 hidden sm:table-cell text-center">
                      <button
                        onClick={() => setSelectedShop(request)}
                        className="text-blue-500 border border-blue-600 px-2 py-1 text-xs md:text-sm hover:text-blue-600 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Only show if there's data and more than one page */}
        {!loading && filteredRequests.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 md:mt-6 gap-3">
            <p className="text-xs md:text-sm text-gray-600 text-center sm:text-left">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredRequests.length)}{" "}
              of {filteredRequests.length}
            </p>
            <div className="flex justify-center gap-1 md:gap-2">
              <button
                className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`w-6 h-6 md:w-8 md:h-8 rounded text-xs md:text-sm ${currentPage === page
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )
              ) : (
                // Show limited pages with ellipsis for larger page counts
                <>
                  {currentPage > 1 && (
                    <button
                      className="w-6 h-6 md:w-8 md:h-8 rounded text-xs md:text-sm text-gray-600 hover:bg-gray-100"
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                  )}
                  {currentPage > 3 && <span className="self-center">...</span>}

                  {currentPage > 2 && (
                    <button
                      className="w-6 h-6 md:w-8 md:h-8 rounded text-xs md:text-sm text-gray-600 hover:bg-gray-100"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </button>
                  )}

                  <button
                    className="w-6 h-6 md:w-8 md:h-8 rounded text-xs md:text-sm bg-blue-500 text-white"
                  >
                    {currentPage}
                  </button>

                  {currentPage < totalPages - 1 && (
                    <button
                      className="w-6 h-6 md:w-8 md:h-8 rounded text-xs md:text-sm text-gray-600 hover:bg-gray-100"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </button>
                  )}

                  {currentPage < totalPages - 2 && <span className="self-center">...</span>}

                  {currentPage < totalPages && (
                    <button
                      className="w-6 h-6 md:w-8 md:h-8 rounded text-xs md:text-sm text-gray-600 hover:bg-gray-100"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                </>
              )}
              <button
                className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                disabled={currentPage === totalPages}
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

export default OnlineShopRequests;