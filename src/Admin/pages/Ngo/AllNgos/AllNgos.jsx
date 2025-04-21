import { useState, useCallback, useEffect } from "react";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import toast from "react-hot-toast";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const AllNgos = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [viewMode, setViewMode] = useState("list");
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [markingActive, setMarkingActive] = useState(false);
  const [markingInactive, setMarkingInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ngoRequests, setNgoRequests] = useState([]);

  // Fetch data from Firestore
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "causeDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const ngoData = doc.data();
        if (
          ngoData &&
          (ngoData.status === "Active" || ngoData.status === "Inactive")
        ) {
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

  // Update status of an NGO
  const handleUpdateStatus = async (id, status) => {
    if (status === "Active") {
      setMarkingActive(true);
    } else if (status === "Inactive") {
      setMarkingInactive(true);
    }

    try {
      const ngoRef = doc(db, "causeDetails", id);
      await updateDoc(ngoRef, {
        status,
        approvedDate:
          status === "Active"
            ? new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : null,
        inactiveDate:
          status === "Inactive"
            ? new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : null,
      });

      // Send email based on status change
      try {
        const emailTemplate =
          status === "Active"
            ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #2c5282;">Your NGO Account Has Been Reactivated!</h2>
              </div>
              
              <p>Dear ${selectedNGO.firstName} ${selectedNGO.lastName},</p>
              
              <p>Great news! Your NGO "${selectedNGO.causeName}" has been reactivated on Shoppiness Mart. You can now resume all activities on our platform.</p>
              
              <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #2d3748; margin-bottom: 10px;">Your Login Credentials:</h3>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${selectedNGO.email}</p>
                <p style="margin: 5px 0;"><strong>Password:</strong> ${selectedNGO.password}</p>
              </div>
              
              <p>You can now:</p>
              <ul style="list-style-type: none; padding-left: 0;">
                <li style="margin: 10px 0;">✅ Access your NGO dashboard</li>
                <li style="margin: 10px 0;">✅ Update your campaigns</li>
                <li style="margin: 10px 0;">✅ Engage with donors</li>
              </ul>
              
              <p>If you have any questions or need assistance, our support team is here to help.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0;">Best regards,</p>
                <p style="margin: 5px 0; color: #4a5568;"><strong>The Shoppiness Mart Team</strong></p>
              </div>
            </div>
          `
            : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #c53030;">Important Notice: NGO Account Deactivated</h2>
              </div>
              
              <p>Dear ${selectedNGO.firstName} ${selectedNGO.lastName},</p>
              
              <p>We regret to inform you that your NGO "${selectedNGO.causeName}" has been temporarily deactivated on Shoppiness Mart.</p>
              
              <div style="background-color: #fff5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #c53030; margin: 5px 0;">During this period:</p>
                <ul style="list-style-type: none; padding-left: 0;">
                  <li style="margin: 5px 0;">• Your NGO profile will not be visible to donors</li>
                  <li style="margin: 5px 0;">• Active campaigns will be paused</li>
                  <li style="margin: 5px 0;">• You won't be able to receive new donations</li>
                </ul>
              </div>
              
              <p>If you believe this is an error or would like to reactivate your account, please contact our support team for assistance.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0;">Best regards,</p>
                <p style="margin: 5px 0; color: #4a5568;"><strong>The Shoppiness Mart Team</strong></p>
              </div>
            </div>
          `;

        await axios.post(`${import.meta.env.VITE_AWS_SERVER}/send-email`, {
          email: selectedNGO.email,
          title:
            status === "Active"
              ? "Shoppiness Mart - NGO Account Reactivated!"
              : "Shoppiness Mart - NGO Account Deactivated",
          body: emailTemplate,
        });
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
        // Don't block the status update if email fails
      }

      toast.success(`Status updated to ${status}`);
      fetchData();
      setViewMode("list");
    } catch (error) {
      console.log("Error updating document: ", error);
      toast.error("Failed to update status");
    } finally {
      if (status === "Active") {
        setMarkingActive(false);
      } else if (status === "Inactive") {
        setMarkingInactive(false);
      }
    }
  };
  // Filter data based on activeTab
  const displayData = ngoRequests.filter((ngo) => ngo.status === activeTab);
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
      <div className="p-4 md:p-6">
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 md:mb-8"
          >
            <FaArrowLeft className="w-4 h-4" />
            View request
          </button>
        </div>

        <div className="bg-white border rounded-lg p-4 md:p-8 shadow-md">
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {/* Image - Responsive for all screens */}
            <div className="relative h-[250px] md:h-[400px] rounded-lg overflow-hidden">
              <img
                src={selectedNGO.bannerUrl || "/placeholder.svg"}
                alt="NGO Featured Image"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Details */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl font-semibold mb-1">
                    {selectedNGO.causeName}
                  </h1>
                  <p className="text-gray-600">{selectedNGO.type}</p>
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0">
                  <img
                    src={selectedNGO.logoUrl || "/placeholder.svg"}
                    alt="NGO Logo"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>

              <div>
                <h2 className="font-medium mb-2">About Cause</h2>
                <p className="text-gray-600">{selectedNGO.aboutCause}</p>
              </div>

              <div>
                <h2 className="font-medium mb-2">Cause / NGO Description</h2>
                <p className="text-gray-600">{selectedNGO.shortDesc}</p>
              </div>

              <div>
                <h2 className="font-medium mb-2">Location</h2>
                <p className="text-gray-600">{selectedNGO.location}</p>
              </div>

              <div>
                <h2 className="font-medium mb-2">PIN</h2>
                <p className="text-gray-600">{selectedNGO.pincode}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h2 className="font-medium mb-2">Account Created by</h2>
                  <p className="text-gray-600">
                    {selectedNGO.firstName + " " + selectedNGO.lastName}
                  </p>
                </div>
                <div>
                  <h2 className="font-medium mb-2">Phone Number</h2>
                  <p className="text-gray-600">{selectedNGO.mobileNumber}</p>
                </div>
                <div>
                  <h2 className="font-medium mb-2">Email ID</h2>
                  <p className="text-gray-600 break-words">{selectedNGO.email}</p>
                </div>
              </div>

              <div className="flex justify-center md:justify-end gap-4 pt-4">
                {activeTab === "Active" && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedNGO.id, "Inactive")
                    }
                    disabled={markingInactive || markingActive}
                    className="px-4 md:px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2 w-full md:w-auto"
                  >
                    {markingInactive && <FaSpinner className="animate-spin" />}
                    Mark as Inactive
                  </button>
                )}
                {activeTab === "Inactive" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedNGO.id, "Active")}
                    disabled={markingActive || markingInactive}
                    className="px-4 md:px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2 w-full md:w-auto"
                  >
                    {markingActive && <FaSpinner className="animate-spin" />}
                    Mark as Active
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-normal mb-4 md:mb-8">All NGOs/Causes</h1>

      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-6 md:mb-8">
        <button
          onClick={() => setActiveTab("Active")}
          className={`px-4 md:px-6 py-2 rounded-md transition-colors ${
            activeTab === "Active"
              ? "bg-[#F7941D] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          Active NGOs/Causes
        </button>
        <button
          onClick={() => setActiveTab("Inactive")}
          className={`px-4 md:px-6 py-2 rounded-md transition-colors ${
            activeTab === "Inactive"
              ? "bg-[#F7941D] text-white"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          Inactive NGOs/Causes
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
                <div className="flex-1 min-w-0 space-y-2 w-full text-center sm:text-left">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto sm:mx-0"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto sm:mx-0"></div>
                </div>
                <div className="flex-1 min-w-0 space-y-2 hidden md:block">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex-1 min-w-0 space-y-2 hidden md:block">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-full sm:w-24"></div>
              </div>
            ))}
          </div>
        ) : paginatedData.length > 0 ? (
          <div className="overflow-x-auto">
            {/* For desktop screens - table layout */}
            <table className="w-full hidden md:table">
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
                      <p className="text-gray-500 text-sm">{ngo.location}</p>
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
                      <p className="text-gray-900">{ngo.createdDate}</p>
                      <p className="text-gray-500 text-sm">Requested date</p>
                    </td>
                    {activeTab === "Active" && (
                      <td className="p-3">
                        <p className="text-gray-900">{ngo.approvedDate}</p>
                        <p className="text-gray-500 text-sm">Activation Date</p>
                      </td>
                    )}
                    {activeTab === "Inactive" && (
                      <td className="p-3">
                        <p className="text-gray-900">{ngo.inactiveDate}</p>
                        <p className="text-red-500 text-sm">Inactivation Date</p>
                      </td>
                    )}
                    <td className="p-3">
                      <button
                        onClick={() => handleViewDetails(ngo)}
                        className="text-blue-500 border border-blue-600 px-2 py-1 hover:text-blue-600 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* For mobile screens - card layout */}
            <div className="md:hidden space-y-4">
              {paginatedData.map((ngo) => (
                <div 
                  key={ngo.id} 
                  className="border rounded-lg p-4 flex flex-col items-center sm:items-start"
                >
                  <div className="flex flex-col sm:flex-row w-full items-center gap-4 mb-3">
                    <img
                      src={ngo.logoUrl || "/placeholder.svg"}
                      alt={`${ngo.causeName} logo`}
                      className="w-16 h-16 object-contain"
                    />
                    <div className="text-center sm:text-left">
                      <h3 className="font-medium text-lg">{ngo.causeName}</h3>
                      <p className="text-gray-500 text-sm">{ngo.location}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 w-full mb-3">
                    <div className="flex justify-between">
                      <p className="text-gray-500 text-sm">Phone:</p>
                      <p className="text-gray-900">{ngo.mobileNumber}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500 text-sm">Email:</p>
                      <p className="text-gray-900 text-sm break-all">{ngo.email}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500 text-sm">Requested:</p>
                      <p className="text-gray-900">{ngo.createdDate}</p>
                    </div>
                    {activeTab === "Active" && (
                      <div className="flex justify-between">
                        <p className="text-gray-500 text-sm">Activated:</p>
                        <p className="text-gray-900">{ngo.approvedDate}</p>
                      </div>
                    )}
                    {activeTab === "Inactive" && (
                      <div className="flex justify-between">
                        <p className="text-gray-500 text-sm">Inactivated:</p>
                        <p className="text-red-500">{ngo.inactiveDate}</p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleViewDetails(ngo)}
                    className="text-blue-500 border border-blue-600 px-4 py-2 hover:text-blue-600 transition-colors w-full sm:w-auto mt-2"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600">
            {activeTab === "Active"
              ? "No Active NGOs/Causes found."
              : "No Inactive NGOs/Causes found."}
          </div>
        )}
      </div>

      {paginatedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-3 gap-3">
          <p className="text-gray-600 text-sm">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, displayData.length)} of{" "}
            {displayData.length}
          </p>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2">
            <button
              className="px-2 sm:px-4 py-1 sm:py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 text-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-sm ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-2 sm:px-4 py-1 sm:py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 text-sm"
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

export default AllNgos;