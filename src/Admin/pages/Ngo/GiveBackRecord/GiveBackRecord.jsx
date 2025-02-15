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
    <div className="p-6">
      <div className="flex px-4 items-center justify-between mb-4">
        <h1 className="text-2xl font-normal mb-8">NGO/Cause Requests</h1>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
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
      <div className="p-6">
        <div className="overflow-x-auto bg-white border shadow-md rounded-xl py-3 px-10">
          <span className="text-gray-500 font-medium">
            {ngoRequests.length} listed NGO
          </span>
          <table className="w-full mt-3">
            <tbody className="flex flex-col gap-3">
              {loading ? (
                // Skeleton loading
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
        <div className="flex items-center justify-between mt-3">
          <p className="text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, sortedNGOs.length)} of{" "}
            {sortedNGOs.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
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
            <button
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
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
