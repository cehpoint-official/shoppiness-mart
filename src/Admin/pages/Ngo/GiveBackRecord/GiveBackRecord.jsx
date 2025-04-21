import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
import { db } from "../../../../../firebase";
import toast from "react-hot-toast";
import NgoDetails from "./NgoDetails";

const ITEMS_PER_PAGE = 5;

const GiveBackRecord = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [ngoRequests, setNgoRequests] = useState([]);
  const [selectedNgoId, setSelectedNgoId] = useState(null); 

  // Fetch data from Firestore
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "causeDetails"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const ngoData = doc.data();
        if (ngoData && ngoData.status === "Active") {
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

  const sortNGOs = (ngos) => {
    switch (sortOption) {
      case "newest":
        return [...ngos].sort(
          (a, b) => b.approvedDate - a.approvedDate
        );
      case "oldest":
        return [...ngos].sort(
          (a, b) => a.approvedDate - b.approvedDate
        );
      case "az":
        return [...ngos].sort((a, b) => a.causeName.localeCompare(b.causeName));
      case "za":
        return [...ngos].sort((a, b) => b.causeName.localeCompare(a.causeName));
      default:
        return ngos;
    }
  };

  const sortedNGOs = sortNGOs(ngoRequests);
  const totalPages = Math.ceil(sortedNGOs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNGOs = sortedNGOs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Handle view details button click
  const handleViewDetails = (ngoId) => {
    setSelectedNgoId(ngoId);
  };

  // Handle back button click from NgoDetails component
  const handleBack = () => {
    setSelectedNgoId(null);
  };

  if (selectedNgoId) {
    return <NgoDetails ngoId={selectedNgoId} onBack={handleBack} />;
  }

  return (
    <div className="p-3 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2 md:px-4 gap-3">
        <h1 className="text-xl md:text-2xl font-normal mb-2 md:mb-0">NGO/Cause Requests</h1>
        <div className="relative self-start sm:self-auto">
          <button
            className="flex items-center gap-2 px-3 md:px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 text-sm md:text-base w-full sm:w-auto justify-center sm:justify-start"
            onClick={() => {
              const select = document.getElementById("sortSelect");
              if (select) {
                select.click();
              }
            }}
          >
            <FaSort />
            <span>Sort by</span>
          </button>
          <select
            id="sortSelect"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Alphabetical (A-Z)</option>
            <option value="za">Alphabetical (Z-A)</option>
          </select>
        </div>
      </div>
      <div className="p-2 md:p-6">
        <div className="bg-white border shadow-md rounded-xl py-3 px-3 md:px-10">
          <span className="text-gray-500 font-medium text-sm md:text-base">
            {ngoRequests.length} listed NGO
          </span>
          
          {/* Mobile card view */}
          <div className="md:hidden mt-3 space-y-4">
            {loading ? (
              // Mobile skeleton loading
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-4 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 w-3/4 rounded"></div>
                      <div className="h-4 bg-gray-200 w-1/2 mt-2 rounded"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="h-5 bg-gray-200 w-1/2 rounded mx-auto"></div>
                      <div className="h-4 bg-gray-200 w-3/4 mt-1 rounded mx-auto"></div>
                    </div>
                    <div>
                      <div className="h-5 bg-gray-200 w-1/2 rounded mx-auto"></div>
                      <div className="h-4 bg-gray-200 w-3/4 mt-1 rounded mx-auto"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))
            ) : paginatedNGOs.length > 0 ? (
              paginatedNGOs.map((ngo) => (
                <div
                  key={ngo.id}
                  className="border rounded-xl p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={ngo.logoUrl}
                      alt={ngo.causeName}
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <h3 className="font-semibold text-base break-words">
                        {ngo.causeName}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        Location: {ngo.location}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3 text-center">
                    <div>
                      <p className="font-semibold text-sm">{ngo.totalGiveBacks}</p>
                      <p className="text-gray-500 text-xs">Total Givebacks</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Rs. {ngo.totalDonationAmount}
                      </p>
                      <p className="text-gray-500 text-xs">Amount</p>
                    </div>
                  </div>
                  <button
                    className="border border-blue-600 px-2 py-1 text-blue-500 hover:bg-blue-50 rounded w-full text-sm"
                    onClick={() => handleViewDetails(ngo.id)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No NGOs listed.
              </div>
            )}
          </div>
          
          {/* Desktop table view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full mt-3">
              <tbody className="flex flex-col gap-3">
                {loading ? (
                  // Desktop skeleton loading
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                    <tr
                      key={index}
                      className="border flex justify-between items-center rounded-xl"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 animate-pulse rounded"></div>
                          <div>
                            <div className="h-6 bg-gray-200 animate-pulse w-32 rounded"></div>
                            <div className="h-4 bg-gray-200 animate-pulse w-24 mt-2 rounded"></div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-4">
                        <div className="h-6 bg-gray-200 animate-pulse w-16 rounded"></div>
                        <div className="h-4 bg-gray-200 animate-pulse w-24 mt-2 rounded"></div>
                      </td>
                      <td className="text-center p-4">
                        <div className="h-6 bg-gray-200 animate-pulse w-16 rounded"></div>
                        <div className="h-4 bg-gray-200 animate-pulse w-24 mt-2 rounded"></div>
                      </td>
                      <td className="text-right p-4">
                        <div className="h-10 bg-gray-200 animate-pulse w-24 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : paginatedNGOs.length > 0 ? (
                  paginatedNGOs.map((ngo) => (
                    <tr
                      key={ngo.id}
                      className="border flex justify-between items-center rounded-xl hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={ngo.logoUrl}
                            alt={ngo.causeName}
                            className="w-16 h-16 object-contain"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {ngo.causeName}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              Location: {ngo.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-4">
                        <p className="font-semibold">{ngo.totalGiveBacks}</p>
                        <p className="text-gray-500 text-sm">Total Givebacks</p>
                      </td>
                      <td className="text-center p-4">
                        <p className="font-semibold">
                          Rs. {ngo.totalDonationAmount}
                        </p>
                        <p className="text-gray-500 text-sm">Amount</p>
                      </td>
                      <td className="text-right p-4">
                        <button
                          className="border border-blue-600 px-2 py-1 text-blue-500 hover:bg-blue-50 rounded"
                          onClick={() => handleViewDetails(ngo.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No NGOs listed.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3">
          <p className="text-gray-600 text-xs sm:text-sm text-center sm:text-left">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, sortedNGOs.length)} of{" "}
            {sortedNGOs.length}
          </p>
          <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 flex-wrap">
            <button
              className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm rounded ${
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
              className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveBackRecord;