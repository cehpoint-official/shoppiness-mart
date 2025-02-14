import { BsArrowLeft } from "react-icons/bs";
import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const ITEMS_PER_PAGE = 10; // Number of items per page

const OfflineShopRequests = () => {
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
        if (offlineShopData && offlineShopData.mode === "Offline") {
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
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #2d3748; margin-bottom: 10px;">Your Login Credentials:</h3>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${shop.email}</p>
                <p style="margin: 5px 0;"><strong>Password:</strong> ${shop.password}</p>
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
      <div className="p-6">
        <button
          onClick={() => setSelectedShop(null)}
          className="flex items-center gap-2 mb-8 hover:text-gray-900"
        >
          <BsArrowLeft className="w-4 h-4" />
          View request
        </button>

        <div className="grid md:grid-cols-2 gap-8 bg-white p-6">
          <div>
            <img
              src={selectedShop.bannerUrl || "/placeholder.svg"}
              alt={selectedShop.businessName}
              className="w-full rounded-lg object-cover aspect-square"
            />
          </div>

          <div>
            <div className="flex items-start gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold">
                  {selectedShop.businessName}
                </h1>
                <p className="text-gray-500">{selectedShop.cat}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="font-medium mb-2">Description</h2>
                <p className="text-gray-600">{selectedShop.shortDesc}</p>
              </div>

              <div>
                <h2 className="font-medium mb-2">Location</h2>
                <p className="text-gray-600">{selectedShop.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="font-medium mb-2">Phone Number</h2>
                  <p className="text-gray-600">{selectedShop.mobileNumber}</p>
                </div>
                <div>
                  <h2 className="font-medium mb-2">Email ID</h2>
                  <p className="text-gray-600">{selectedShop.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">SHOP DETAILS</h2>
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 text-sm text-gray-500">
                      Business/Services Owner Name
                    </td>
                    <td className="py-3 text-sm">{selectedShop.owner}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-gray-500">
                      Business/Services Mode
                    </td>
                    <td className="py-3 text-sm">{selectedShop.mode}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-gray-500">Email</td>
                    <td className="py-3 text-sm">{selectedShop.email}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-gray-500">
                      Shop Category
                    </td>
                    <td className="py-3 text-sm">{selectedShop.cat}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-gray-500">
                      Commission rate
                    </td>
                    <td className="py-3 text-sm flex gap-4 items-center">
                      {editingRate === selectedShop.id ? (
                        <input
                          type="text"
                          value={tempRate}
                          onChange={(e) => setTempRate(e.target.value)}
                          className="border rounded px-2 py-1 w-24"
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
                  <tr>
                    <td className="py-3 text-sm text-gray-500">LOGO</td>
                    <td className="py-3">
                      <img
                        src={selectedShop.logoUrl || "/placeholder.svg"}
                        alt="Shop logo"
                        className="w-24 h-24 object-contain"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 mt-8">
              {activeTab === "Pending" && (
                <button
                  onClick={() => handleRejectRequest(selectedShop)}
                  className="px-6 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  {rejecting && <FaSpinner className="animate-spin" />}
                  Reject Request
                </button>
              )}
              <button
                onClick={() => handleAcceptRequest(selectedShop)}
                className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                {accepting && <FaSpinner className="animate-spin" />}
                Accept Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Offline Shop Requests</h1>
      <div className="bg-white p-6 rounded-xl border shadow-md">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === "Pending"
                ? "bg-[#F7941D] text-white"
                : "border border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("Pending")}
          >
            Product/Service Requests
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === "Rejected"
                ? "bg-[#F7941D] text-white"
                : "border border-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("Rejected")}
          >
            Rejected Product/Service Requests
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {loading ? (
                // Skeleton loading effect
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded bg-gray-200 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 w-3/4 bg-gray-200 animate-pulse mb-2"></div>
                          <div className="h-3 w-1/2 bg-gray-200 animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <div className="h-4 w-3/4 bg-gray-200 animate-pulse mb-2"></div>
                          <div className="h-3 w-1/2 bg-gray-200 animate-pulse"></div>
                        </div>
                        <div>
                          <div className="h-4 w-3/4 bg-gray-200 animate-pulse mb-2"></div>
                          <div className="h-3 w-1/2 bg-gray-200 animate-pulse"></div>
                        </div>
                        <div>
                          <div className="h-4 w-3/4 bg-gray-200 animate-pulse mb-2"></div>
                          <div className="h-3 w-1/2 bg-gray-200 animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-8 w-24 bg-gray-200 animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-gray-500">
                    {activeTab === "Pending"
                      ? "There are no pending business requests."
                      : "There are no rejected businesses"}
                  </td>
                </tr>
              ) : (
                paginatedData.map((request) => (
                  <tr key={request.id} className="border-b border-t">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={request.logoUrl || "/placeholder.svg"}
                          alt={request.businessName}
                          className="w-20 h-20 rounded object-cover"
                        />
                        <div>
                          <h3 className="font-medium">
                            {request.businessName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {request.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <p className="text-sm">{request.mobileNumber}</p>
                          <p className="text-xs text-gray-500">Phone</p>
                        </div>
                        <div>
                          <p className="text-sm">{request.email}</p>
                          <p className="text-xs text-gray-500">Email</p>
                        </div>
                        <div>
                          {activeTab === "Pending" ? (
                            <>
                              <p className="text-sm">{request.createdDate}</p>
                              <p className="text-xs text-gray-500">
                                Requested Date
                              </p>
                            </>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm">{request.createdDate}</p>
                                <p className="text-xs text-gray-500">
                                  Requested Date
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-red-500">
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
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedShop(request)}
                        className="text-blue-500 border border-blue-600 px-2 py-1 hover:text-blue-600 transition-colors"
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

        {/* Pagination */}
        {/* Pagination - Only show if there's data and more than one page */}
        {!loading && filteredRequests.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredRequests.length)}{" "}
              of {filteredRequests.length}
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
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

export default OfflineShopRequests;
