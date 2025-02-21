import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../../../firebase";
import { FaSpinner, FaArrowLeft, FaCheck } from "react-icons/fa";

// Skeleton loader component
const SkeletonRow = () => {
  return (
    <tr className="border-b animate-pulse">
      <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded"></div></td>
    </tr>
  );
};

// Donation details component
const DonationDetails = ({ donation, onBack, onVerify, isVerifying }) => {
  return (
    <div className="bg-white m-10 rounded-lg shadow-lg p-6 animate-fadeIn">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Donations
        </button>
        <h2 className="text-xl font-semibold">Donation Details</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Donor Name</p>
            <p className="text-lg font-medium">{donation.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg">{donation.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">PAN Card</p>
            <p className="text-lg font-mono">{donation.panCard}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-lg font-semibold">₹{donation.amount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Donation Type</p>
            <p className="text-lg capitalize">{donation.donationType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created Date</p>
            <p className="text-lg">{donation.createdAt}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`px-3 py-1 rounded-full text-sm ${
              donation.status === "verified" 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {donation.status}
            </span>
          </div>
          {donation.verifiedAt && (
            <div>
              <p className="text-sm text-gray-500">Verified On</p>
              <p className="text-lg">{donation.verifiedAt}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-b py-6 my-6">
        <h3 className="text-lg font-medium mb-4">Receipt Details</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <p className="text-sm text-gray-500 mb-2">Receipt File</p>
            <p className="mb-4">{donation.receiptFileName} ({donation.fileType})</p>
            <a 
              href={donation.receiptURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded transition-colors"
            >
              View Receipt
            </a>
          </div>
        </div>
      </div>
      
      {donation.status !== "verified" && (
        <div className="flex justify-end mt-8">
          <button
            onClick={onVerify}
            disabled={isVerifying}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors disabled:bg-green-400"
          >
            {isVerifying ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Verifying...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" /> Verify Donation
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const AllDonations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("pending");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const itemsPerPage = 5;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "directDonationRequests"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const donationData = doc.data();
        data.push({ id: doc.id, ...donationData });
      });
      setDonations(data);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
  };

  const handleBack = () => {
    setSelectedDonation(null);
  };

  const handleVerifyDonation = async () => {
    if (!selectedDonation) return;
    
    try {
      setIsVerifying(true);
      
      const verifiedDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      
      await updateDoc(doc(db, "directDonationRequests", selectedDonation.id), {
        status: "verified",
        verifiedAt: verifiedDate
      });
      
      // Update local state
      setDonations(prev => 
        prev.map(donation => 
          donation.id === selectedDonation.id 
            ? { ...donation, status: "verified", verifiedAt: verifiedDate }
            : donation
        )
      );
      
      setSelectedDonation(prev => ({
        ...prev,
        status: "verified",
        verifiedAt: verifiedDate
      }));
      
    } catch (error) {
      console.error("Error verifying donation:", error);
      alert("Failed to verify donation. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const sortDonations = (donations) => {
    switch (sortBy) {
      case "newest":
        return [...donations].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return [...donations].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "az":
        return [...donations].sort((a, b) => a.name.localeCompare(b.name));
      case "za":
        return [...donations].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return donations;
    }
  };

  const filteredDonations = donations.filter(donation => 
    activeTab === "pending" 
      ? donation.status !== "verified" 
      : donation.status === "verified"
  );
  
  const sortedDonations = sortDonations(filteredDonations);
  const totalPages = Math.ceil(sortedDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedDonations = sortedDonations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (selectedDonation) {
    return (
      <DonationDetails 
        donation={selectedDonation}
        onBack={handleBack}
        onVerify={handleVerifyDonation}
        isVerifying={isVerifying}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-2xl font-semibold">Donation Management</h1>
        <div className="relative">
          <select
            className="appearance-none border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-4 font-medium ${
              activeTab === "pending"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => {
              setActiveTab("pending");
              setCurrentPage(1);
            }}
          >
            Pending Requests
          </button>
          <button
            className={`px-6 py-4 font-medium ${
              activeTab === "verified"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => {
              setActiveTab("verified");
              setCurrentPage(1);
            }}
          >
            Verified Donations
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="p-4 font-medium text-gray-600">Donor Name</th>
                <th className="p-4 font-medium text-gray-600">Email</th>
                <th className="p-4 font-medium text-gray-600">
                  {activeTab === "verified" ? "Verified Date" : "Requested Date"}
                </th>
                <th className="p-4 font-medium text-gray-600">Amount</th>
                <th className="p-4 font-medium text-gray-600">Status</th>
                <th className="p-4 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : displayedDonations.length > 0 ? (
                displayedDonations.map((donation) => (
                  <tr key={donation.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{donation.name}</td>
                    <td className="p-4">{donation.email}</td>
                    <td className="p-4">
                      {activeTab === "verified" ? donation.verifiedAt : donation.createdAt}
                    </td>
                    <td className="p-4 font-semibold">₹{donation.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        donation.status === "verified" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewDetails(donation)}
                        className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No {activeTab === "pending" ? "pending" : "verified"} donations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {displayedDonations.length > 0 && (
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 mb-4 sm:mb-0">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, sortedDonations.length)} of{" "}
              {sortedDonations.length} {activeTab === "pending" ? "pending" : "verified"} donations
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {totalPages <= 5 ? (
                [...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`w-8 h-8 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                <>
                  {currentPage > 1 && (
                    <button
                      className="w-8 h-8 rounded hover:bg-gray-100"
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                  )}
                  {currentPage > 2 && <span className="px-1">...</span>}
                  {currentPage > 1 && currentPage < totalPages && (
                    <button
                      className="w-8 h-8 rounded bg-blue-600 text-white"
                    >
                      {currentPage}
                    </button>
                  )}
                  {currentPage < totalPages - 1 && <span className="px-1">...</span>}
                  {currentPage < totalPages && (
                    <button
                      className="w-8 h-8 rounded hover:bg-gray-100"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                </>
              )}
              <button
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                disabled={currentPage === totalPages || totalPages === 0}
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

export default AllDonations;